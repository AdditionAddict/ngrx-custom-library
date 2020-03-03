import { Injectable, Inject } from '@angular/core';
import { Action, ScannedActionsSubject, Store } from '@ngrx/store';

import { Observable, of, Subscription, throwError } from 'rxjs';
import { filter, mergeMap, shareReplay, take } from 'rxjs/operators';

import { CorrelationIdGenerator } from '../utils/correlation-id-generator';
import { NxaEntityActionOptions } from '../actions/entity-action';
import { NxaEntityCache } from '../reducers/entity-cache';
import { NxaEntityDispatcherDefaultOptions } from './entity-dispatcher-default-options';

import { NxaMergeStrategy } from '../actions/merge-strategy';
import { NxaPersistanceCanceled } from './entity-dispatcher';

import { NxaChangeSet, NxaChangeSetItem } from '../actions/entity-cache-change-set';
import {
    NxaClearCollections,
    NxaEntityCacheAction,
    NxaEntityCacheQuerySet,
    NxaLoadCollections,
    NxaMergeQuerySet,
    NxaSetEntityCache,
    NxaSaveEntities,
    NxaSaveEntitiesCancel,
    NxaSaveEntitiesError,
    NxaSaveEntitiesSuccess,
} from '../actions/entity-cache-action';

/**
 * Dispatches Entity Cache actions to the NxaEntityCache reducer
 */
@Injectable()
export class NxaEntityCacheDispatcher {
    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     */
    reducedActions$: Observable<Action>;
    private raSubscription: Subscription;

    constructor(
        /** Generates correlation ids for query and save methods */
        private correlationIdGenerator: CorrelationIdGenerator,
        /**
         * Dispatcher options configure dispatcher behavior such as
         * whether add is optimistic or pessimistic by default.
         */
        private defaultDispatcherOptions: NxaEntityDispatcherDefaultOptions,
        /** Actions scanned by the store after it processed them with reducers. */
        @Inject(ScannedActionsSubject) scannedActions$: Observable<Action>,
        /** The store, scoped to the NxaEntityCache */
        private store: Store<NxaEntityCache>
    ) {
        // Replay because sometimes in tests will fake data service with synchronous observable
        // which makes subscriber miss the dispatched actions.
        // Of course that's a testing mistake. But easy to forget, leading to painful debugging.
        this.reducedActions$ = scannedActions$.pipe(shareReplay(1));
        // Start listening so late subscriber won't miss the most recent action.
        this.raSubscription = this.reducedActions$.subscribe();
    }

    /**
     * Dispatch an Action to the store.
     * @param action the Action
     * @returns the dispatched Action
     */
    dispatch(action: Action): Action {
        this.store.dispatch(action);
        return action;
    }

    /**
     * Dispatch action to cancel the NxaSaveEntities request with matching correlation id.
     * @param correlationId The correlation id for the corresponding action
     * @param [reason] explains why canceled and by whom.
     * @param [entityNames] array of entity names so can turn off loading flag for their collections.
     * @param [tag] tag to identify the operation from the app perspective.
     */
    cancelNxaSaveEntities(
        correlationId: any,
        reason?: string,
        entityNames?: string[],
        tag?: string
    ): void {
        if (!correlationId) {
            throw new Error('Missing correlationId');
        }
        const action = new NxaSaveEntitiesCancel(
            correlationId,
            reason,
            entityNames,
            tag
        );
        this.dispatch(action);
    }

    /** Clear the named entity collections in cache
     * @param [collections] Array of names of the collections to clear.
     * If empty array, does nothing. If null/undefined/no array, clear all collections.
     * @param [tag] tag to identify the operation from the app perspective.
     */
    NxaClearCollections(collections?: string[], tag?: string) {
        this.dispatch(new NxaClearCollections(collections, tag));
    }

    /**
     * Load multiple entity collections at the same time.
     * before any selectors$ observables emit.
     * @param collections The collections to load, typically the result of a query.
     * @param [tag] tag to identify the operation from the app perspective.
     * in the form of a map of entity collections.
     */
    NxaLoadCollections(collections: NxaEntityCacheQuerySet, tag?: string) {
        this.dispatch(new NxaLoadCollections(collections, tag));
    }

    /**
     * Merges entities from a query result
     * that returned entities from multiple collections.
     * Corresponding entity cache reducer should add and update all collections
     * at the same time, before any selectors$ observables emit.
     * @param querySet The result of the query in the form of a map of entity collections.
     * These are the entity data to merge into the respective collections.
     * @param mergeStrategy How to merge a queried entity when it is already in the collection.
     * The default is NxaMergeStrategy.PreserveChanges
     * @param [tag] tag to identify the operation from the app perspective.
     */
    NxaMergeQuerySet(
        querySet: NxaEntityCacheQuerySet,
        mergeStrategy?: NxaMergeStrategy,
        tag?: string
    ) {
        this.dispatch(new NxaMergeQuerySet(querySet, mergeStrategy, tag));
    }

    /**
     * Create entity cache action for replacing the entire entity cache.
     * Dangerous because brute force but useful as when re-hydrating an NxaEntityCache
     * from local browser storage when the application launches.
     * @param cache New state of the entity cache
     * @param [tag] tag to identify the operation from the app perspective.
     */
    NxaSetEntityCache(cache: NxaEntityCache, tag?: string) {
        this.dispatch(new NxaSetEntityCache(cache, tag));
    }

    /**
     * Dispatch action to save multiple entity changes to remote storage.
     * Relies on an Ngrx Effect such as NxaEntityEffects.NxaSaveEntities$.
     * Important: only call if your server supports the NxaSaveEntities protocol
     * through your NxaEntityDataService.NxaSaveEntities method.
     * @param changes Either the entities to save, as an array of {NxaChangeSetItem}, or
     * a NxaChangeSet that holds such changes.
     * @param url The server url which receives the save request
     * @param [options] options such as tag, correlationId, isOptimistic, and mergeStrategy.
     * These values are defaulted if not supplied.
     * @returns A terminating Observable<NxaChangeSet> with data returned from the server
     * after server reports successful save OR the save error.
     * TODO: should return the matching entities from cache rather than the raw server data.
     */
    NxaSaveEntities(
        changes: NxaChangeSetItem[] | NxaChangeSet,
        url: string,
        options?: NxaEntityActionOptions
    ): Observable<NxaChangeSet> {
        const NxaChangeSet = Array.isArray(changes) ? { changes } : changes;
        options = options || {};
        const correlationId =
            options.correlationId == null
                ? this.correlationIdGenerator.next()
                : options.correlationId;
        const isOptimistic =
            options.isOptimistic == null
                ? this.defaultDispatcherOptions.optimisticNxaSaveEntities || false
                : options.isOptimistic === true;
        const tag = options.tag || 'Save Entities';
        options = { ...options, correlationId, isOptimistic, tag };
        const action = new NxaSaveEntities(NxaChangeSet, url, options);
        this.dispatch(action);
        return this.getNxaSaveEntitiesResponseData$(options.correlationId).pipe(
            shareReplay(1)
        );
    }

    /**
     * Return Observable of data from the server-success NxaSaveEntities action with
     * the given Correlation Id, after that action was processed by the ngrx store.
     * or else put the server error on the Observable error channel.
     * @param crid The correlationId for both the save and response actions.
     */
    private getNxaSaveEntitiesResponseData$(crid: any): Observable<NxaChangeSet> {
        /**
         * reducedActions$ must be replay observable of the most recent action reduced by the store.
         * because the response action might have been dispatched to the store
         * before caller had a chance to subscribe.
         */
        return this.reducedActions$.pipe(
            filter(
                (act: Action) =>
                    act.type === NxaEntityCacheAction.SAVE_ENTITIES_SUCCESS ||
                    act.type === NxaEntityCacheAction.SAVE_ENTITIES_ERROR ||
                    act.type === NxaEntityCacheAction.SAVE_ENTITIES_CANCEL
            ),
            filter((act: Action) => crid === (act as any).payload.correlationId),
            take(1),
            mergeMap(act => {
                return act.type === NxaEntityCacheAction.SAVE_ENTITIES_CANCEL
                    ? throwError(
                        new NxaPersistanceCanceled(
                            (act as NxaSaveEntitiesCancel).payload.reason
                        )
                    )
                    : act.type === NxaEntityCacheAction.SAVE_ENTITIES_SUCCESS
                        ? of((act as NxaSaveEntitiesSuccess).payload.NxaChangeSet)
                        : throwError((act as NxaSaveEntitiesError).payload);
            })
        );
    }
}