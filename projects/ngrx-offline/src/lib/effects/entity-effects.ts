import { Inject, Injectable, Optional } from '@angular/core';
import { Action } from '@ngrx/store';
import { Actions, createEffect } from '@ngrx/effects';
import { Update } from '@ngrx/entity';

import { asyncScheduler, Observable, of, race, SchedulerLike } from 'rxjs';
import { catchError, delay, filter, map, mergeMap, switchMap, withLatestFrom, tap } from 'rxjs/operators';

import { ENTITY_EFFECTS_SCHEDULER } from './entity-effects-scheduler';

import { NxaEntityAction } from '../actions/entity-action';
import { NxaEntityActionFactory } from '../actions/entity-action-factory';
import { NxaEntityOp, makeNxaSuccessOp } from '../actions/entity-op';
import { ofNxaEntityOp } from '../actions/entity-action-operators';
import { NxaUpdateResponseData } from '../actions/update-response-data';

import { NxaEntityDataService } from '../dataservices/entity-data.service';
import { NxaPersistenceResultHandler } from '../dataservices/persistence-result-handler.service';

import { NxaOnlineCheckService } from '../offline-services/online-check-service'
import { NxaEntityOfflineService } from '../offline-services/entity-offline.service';
import { NxaOfflinePersistenceResultHandler } from '../offline-services/offline-persistence-result-handler.service';
import { NxaEntityCollectionDataService } from '../dataservices/interfaces';

export const persistNxaOps: NxaEntityOp[] = [
    NxaEntityOp.QUERY_ALL,
    NxaEntityOp.QUERY_LOAD,
    NxaEntityOp.QUERY_BY_KEY,
    NxaEntityOp.QUERY_MANY,
    NxaEntityOp.SAVE_ADD_ONE,
    NxaEntityOp.SAVE_DELETE_ONE,
    NxaEntityOp.SAVE_UPDATE_ONE,
    NxaEntityOp.SAVE_UPSERT_ONE,
];

@Injectable()
export class NxaEntityEffects {
    // See https://github.com/ReactiveX/rxjs/blob/master/doc/marble-testing.md
    /** Delay for error and skip observables. Must be multiple of 10 for marble testing. */
    private responseDelay = 10;

    /**
     * Observable of non-null cancellation correlation ids from CANCEL_PERSIST actions
     */
    cancel$: Observable<any> = createEffect(
        () =>
            this.actions.pipe(
                ofNxaEntityOp(NxaEntityOp.CANCEL_PERSIST),
                map((action: NxaEntityAction) => action.payload.correlationId),
                filter(id => id != null)
            ),
        { dispatch: false }
    );

    // `mergeMap` allows for concurrent requests which may return in any order
    persist$: Observable<Action> = createEffect(() =>
        this.actions.pipe(
            ofNxaEntityOp(persistNxaOps),
            mergeMap((action: NxaEntityAction<any>) => {
                const online$ = this.onlineCheckService.online$();
                return of(action).pipe(
                    /** Lazy check online stream */
                    withLatestFrom(online$),
                    switchMap(([action, isOnline]) => this.persist(action, isOnline))
                )
            })
        )
    );

    constructor(
        // actions
        private actions: Actions<NxaEntityAction>,
        private nxaEntityActionFactory: NxaEntityActionFactory,
        // check mode service
        private onlineCheckService: NxaOnlineCheckService,
        // online mode
        private dataService: NxaEntityDataService,
        private resultHandler: NxaPersistenceResultHandler,
        // offline mode
        private offlineService: NxaEntityOfflineService,
        private resultHandlerOffline: NxaOfflinePersistenceResultHandler,
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
     * Perform the requested persistence operation and return a scalar Observable<Action>
     * that the effect should dispatch to the store after the server responds.
     * @param action A persistence operation NxaEntityAction
     */
    persist(action: NxaEntityAction, isOnline: boolean): Observable<Action> {
        if (action.payload.skip && isOnline) {
            // Should not persist. Pretend it succeeded.
            return this.handleSkipSuccess$(action);
        }
        if (action.payload.error) {
            return this.handleError$(action, isOnline)(action.payload.error);
        }
        try {
            // Cancellation: returns Observable of CANCELED_PERSIST for a persistence NxaEntityAction
            // whose correlationId matches cancellation correlationId
            const c = this.cancel$.pipe(
                filter(id => action.payload.correlationId === id),
                map(id =>
                    this.nxaEntityActionFactory.createFromAction(action, {
                        entityOp: NxaEntityOp.CANCELED_PERSIST,
                    })
                )
            );

            // Data: entity collection DataService result as a successful persistence NxaEntityAction
            const d = this.callDataService(action, isOnline).pipe(
                map(result => isOnline ?
                    this.resultHandler.handleSuccess(action)(result) :
                    this.resultHandlerOffline.handleSuccess(action)(result)
                ),
                catchError(this.handleError$(action, isOnline))
            );

            // Emit which ever gets there first; the other observable is terminated.
            return race(c, d);
        } catch (err) {
            return this.handleError$(action, isOnline)(err);
        }
    }

    private callDataService<T>(action: NxaEntityAction, isOnline: boolean) {
        const { entityName, entityOp, data } = action.payload;
        const service = isOnline ?
            this.dataService.getService(entityName) :
            this.offlineService.getService(entityName)
        switch (entityOp) {
            case NxaEntityOp.QUERY_ALL:
            case NxaEntityOp.QUERY_LOAD:
                return service.getAll();

            case NxaEntityOp.QUERY_BY_KEY:
                return service.getById(data);

            case NxaEntityOp.QUERY_MANY:
                return service.getWithQuery(data);

            case NxaEntityOp.SAVE_ADD_ONE:
                return service.add(data);

            case NxaEntityOp.SAVE_DELETE_ONE:
                return service.delete(data);

            case NxaEntityOp.SAVE_UPDATE_ONE:
                const { id, changes } = data as Update<any>; // data must be Update<T>
                return service.update(data).pipe(
                    map((updatedEntity: any) => {
                        // Return an Update<T> with updated entity data.
                        // If server returned entity data, merge with the changes that were sent
                        // and set the 'changed' flag to true.
                        // If server did not return entity data,
                        // assume it made no additional changes of its own, return the original changes,
                        // and set the `changed` flag to `false`.
                        const hasData =
                            updatedEntity && Object.keys(updatedEntity).length > 0;
                        const responseData: NxaUpdateResponseData<any> = hasData
                            ? { id, changes: { ...changes, ...updatedEntity }, changed: true }
                            : { id, changes, changed: false };
                        return responseData;
                    })
                );

            case NxaEntityOp.SAVE_UPSERT_ONE:
                return service.upsert(data).pipe(
                    map((upsertedEntity: any) => {
                        const hasData =
                            upsertedEntity && Object.keys(upsertedEntity).length > 0;
                        return hasData ? upsertedEntity : data; // ensure a returned entity value.
                    })
                );
            default:
                throw new Error(`Persistence action "${entityOp}" is not implemented. Online mode: ${isOnline}.`);
        }
    }

    /**
     * Handle error result of persistence operation on an NxaEntityAction,
     * returning a scalar observable of error action
     */
    private handleError$(
        action: NxaEntityAction,
        isOnline: boolean
    ): (error: Error) => Observable<NxaEntityAction> {
        // Although error may return immediately,
        // ensure observable takes some time,
        // as app likely assumes asynchronous response.
        return (error: Error) =>
            isOnline ?
                of(this.resultHandler.handleError(action)(error)).pipe(
                    delay(this.responseDelay, this.scheduler || asyncScheduler)
                ) :
                of(this.resultHandlerOffline.handleError(action)(error)).pipe(
                    delay(this.responseDelay, this.scheduler || asyncScheduler)
                )
    }

    /**
     * Because NxaEntityAction.payload.skip is true, skip the persistence step and
     * return a scalar success action that looks like the operation succeeded.
     * 
     * Online mode only
     */
    private handleSkipSuccess$(
        originalAction: NxaEntityAction
    ): Observable<NxaEntityAction> {
        const successOp = makeNxaSuccessOp(originalAction.payload.entityOp);
        const successAction = this.nxaEntityActionFactory.createFromAction(
            originalAction,
            {
                entityOp: successOp,
            }
        );
        // Although returns immediately,
        // ensure observable takes one tick (by using a promise),
        // as app likely assumes asynchronous response.
        return of(successAction).pipe(
            delay(this.responseDelay, this.scheduler || asyncScheduler)
        );
    }
}