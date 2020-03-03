import { Inject, Injectable, Optional } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, ofType, createEffect } from '@ngrx/effects';

import {
    asyncScheduler,
    Observable,
    of,
    merge,
    race,
    SchedulerLike,
} from 'rxjs';
import {
    concatMap,
    catchError,
    delay,
    filter,
    map,
    mergeMap,
} from 'rxjs/operators';

import { NxaDataServiceError } from '../dataservices/data-service-error';
import {
    NxaChangeSet,
    excludeEmptyNxaChangeSetItems,
} from '../actions/entity-cache-change-set';
import { NxaEntityActionFactory } from '../actions/entity-action-factory';
import { NxaEntityOp } from '../actions/entity-op';

import {
    NxaEntityCacheAction,
    NxaSaveEntities,
    NxaSaveEntitiesCancel,
    NxaSaveEntitiesCanceled,
    NxaSaveEntitiesError,
    NxaSaveEntitiesSuccess,
} from '../actions/entity-cache-action';
import { NxaEntityCacheDataService } from '../dataservices/entity-cache-data.service';
import { ENTITY_EFFECTS_SCHEDULER } from './entity-effects-scheduler';
import { Logger } from '../utils/interfaces';

@Injectable()
export class NxaEntityCacheEffects {
    // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
    /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
    private responseDelay = 10;

    constructor(
        private actions: Actions,
        private dataService: NxaEntityCacheDataService,
        private NxaEntityActionFactory: NxaEntityActionFactory,
        private logger: Logger,
        /**
         * Injecting an optional Scheduler that will be undefined
         * in normal application usage, but its injected here so that you can mock out
         * during testing using the RxJS TestScheduler for simulating passages of time.
         */
        @Optional()
        @Inject(ENTITY_EFFECTS_SCHEDULER)
        private scheduler: SchedulerLike
    ) { }

    /**
     * Observable of SAVE_ENTITIES_CANCEL actions with non-null correlation ids
     */
    NxaSaveEntitiesCancel$: Observable<NxaSaveEntitiesCancel> = createEffect(
        () =>
            this.actions.pipe(
                ofType(NxaEntityCacheAction.SAVE_ENTITIES_CANCEL),
                filter((a: NxaSaveEntitiesCancel) => a.payload.correlationId != null)
            ),
        { dispatch: false }
    );

    // Concurrent persistence requests considered unsafe.
    // `mergeMap` allows for concurrent requests which may return in any order
    NxaSaveEntities$: Observable<Action> = createEffect(() =>
        this.actions.pipe(
            ofType(NxaEntityCacheAction.SAVE_ENTITIES),
            mergeMap((action: NxaSaveEntities) => this.NxaSaveEntities(action))
        )
    );

    /**
     * Perform the requested NxaSaveEntities actions and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action The NxaSaveEntities action
     */
    NxaSaveEntities(action: NxaSaveEntities): Observable<Action> {
        const error = action.payload.error;
        if (error) {
            return this.handleNxaSaveEntitiesError$(action)(error);
        }
        try {
            const NxaChangeSet = excludeEmptyNxaChangeSetItems(action.payload.NxaChangeSet);
            const { correlationId, mergeStrategy, tag, url } = action.payload;
            const options = { correlationId, mergeStrategy, tag };

            if (NxaChangeSet.changes.length === 0) {
                // nothing to save
                return of(new NxaSaveEntitiesSuccess(NxaChangeSet, url, options));
            }

            // Cancellation: returns Observable<NxaSaveEntitiesCanceled> for a NxaSaveEntities action
            // whose correlationId matches the cancellation correlationId
            const c = this.NxaSaveEntitiesCancel$.pipe(
                filter(a => correlationId === a.payload.correlationId),
                map(
                    a =>
                        new NxaSaveEntitiesCanceled(
                            correlationId,
                            a.payload.reason,
                            a.payload.tag
                        )
                )
            );

            // Data: NxaSaveEntities result as a NxaSaveEntitiesSuccess action
            const d = this.dataService.NxaSaveEntities(NxaChangeSet, url).pipe(
                concatMap(result =>
                    this.handleNxaSaveEntitiesSuccess$(action, this.NxaEntityActionFactory)(
                        result
                    )
                ),
                catchError(this.handleNxaSaveEntitiesError$(action))
            );

            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        } catch (err) {
            return this.handleNxaSaveEntitiesError$(action)(err);
        }
    }

    /** return handler of error result of NxaSaveEntities, returning a scalar observable of error action */
    private handleNxaSaveEntitiesError$(
        action: NxaSaveEntities
    ): (err: NxaDataServiceError | Error) => Observable<Action> {
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (err: NxaDataServiceError | Error) => {
            const error =
                err instanceof NxaDataServiceError ? err : new NxaDataServiceError(err, null);
            return of(new NxaSaveEntitiesError(error, action)).pipe(
                delay(this.responseDelay, this.scheduler || asyncScheduler)
            );
        };
    }

    /** return handler of the NxaChangeSet result of successful NxaSaveEntities() */
    private handleNxaSaveEntitiesSuccess$(
        action: NxaSaveEntities,
        NxaEntityActionFactory: NxaEntityActionFactory
    ): (NxaChangeSet: NxaChangeSet) => Observable<Action> {
        const { url, correlationId, mergeStrategy, tag } = action.payload;
        const options = { correlationId, mergeStrategy, tag };

        return NxaChangeSet => {
            // DataService returned a NxaChangeSet with possible updates to the saved entities
            if (NxaChangeSet) {
                return of(new NxaSaveEntitiesSuccess(NxaChangeSet, url, options));
            }

            // No NxaChangeSet = Server probably responded '204 - No Content' because
            // it made no changes to the inserted/updated entities.
            // Respond with success action best on the NxaChangeSet in the request.
            NxaChangeSet = action.payload.NxaChangeSet;

            // If pessimistic save, return success action with the original NxaChangeSet
            if (!action.payload.isOptimistic) {
                return of(new NxaSaveEntitiesSuccess(NxaChangeSet, url, options));
            }

            // If optimistic save, avoid cache grinding by just turning off the loading flags
            // for all collections in the original NxaChangeSet
            const entityNames = NxaChangeSet.changes.reduce(
                (acc, item) =>
                    acc.indexOf(item.entityName) === -1
                        ? acc.concat(item.entityName)
                        : acc,
                [] as string[]
            );
            return merge(
                entityNames.map(name =>
                    NxaEntityActionFactory.create(name, NxaEntityOp.SET_LOADING, false)
                )
            );
        };
    }
}