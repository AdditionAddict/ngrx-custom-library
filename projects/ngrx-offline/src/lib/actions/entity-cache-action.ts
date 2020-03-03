/*
 * Actions dedicated to the NxaEntityCache as a whole
 */
import { Action } from '@ngrx/store';

import { NxaChangeSet, NxaChangeSetOperation } from './entity-cache-change-set';
export { NxaChangeSet, NxaChangeSetOperation } from './entity-cache-change-set';

import { NxaDataServiceError } from '../dataservices/data-service-error';
import { NxaEntityActionOptions } from '../actions/entity-action';
import { NxaEntityCache } from '../reducers/entity-cache';
import { NxaMergeStrategy } from '../actions/merge-strategy';

export enum NxaEntityCacheAction {
    CLEAR_COLLECTIONS = '@@ngrx/action/entity-cache/clear-collections',
    LOAD_COLLECTIONS = '@@ngrx/action/entity-cache/load-collections',
    MERGE_QUERY_SET = '@@ngrx/action/entity-cache/merge-query-set',
    SET_NXA_ENTITY_CACHE = '@@ngrx/action/entity-cache/set-cache',

    SAVE_ENTITIES = '@@ngrx/action/entity-cache/save-entities',
    SAVE_ENTITIES_CANCEL = '@@ngrx/action/entity-cache/save-entities-cancel',
    SAVE_ENTITIES_CANCELED = '@@ngrx/action/entity-cache/save-entities-canceled',
    SAVE_ENTITIES_ERROR = '@@ngrx/action/entity-cache/save-entities-error',
    SAVE_ENTITIES_SUCCESS = '@@ngrx/action/entity-cache/save-entities-success',
}

/**
 * Hash of entities keyed by EntityCollection name,
 * typically the result of a query that returned results from a multi-collection query
 * that will be merged into an NxaEntityCache via the `NxaMergeQuerySet` action.
 */
export interface NxaEntityCacheQuerySet {
    [entityName: string]: any[];
}

/**
 * Clear the collections identified in the collectionSet.
 * @param [collections] Array of names of the collections to clear.
 * If empty array, does nothing. If no array, clear all collections.
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
export class NxaClearCollections implements Action {
    readonly payload: { collections?: string[]; tag?: string };
    readonly type = NxaEntityCacheAction.CLEAR_COLLECTIONS;

    constructor(collections?: string[], tag?: string) {
        this.payload = { collections, tag };
    }
}

/**
 * Create entity cache action that loads multiple entity collections at the same time.
 * before any selectors$ observables emit.
 * @param querySet The collections to load, typically the result of a query.
 * @param [tag] Optional tag to identify the operation from the app perspective.
 * in the form of a map of entity collections.
 */
export class NxaLoadCollections implements Action {
    readonly payload: { collections: NxaEntityCacheQuerySet; tag?: string };
    readonly type = NxaEntityCacheAction.LOAD_COLLECTIONS;

    constructor(collections: NxaEntityCacheQuerySet, tag?: string) {
        this.payload = { collections, tag };
    }
}

/**
 * Create entity cache action that merges entities from a query result
 * that returned entities from multiple collections.
 * Corresponding entity cache reducer should add and update all collections
 * at the same time, before any selectors$ observables emit.
 * @param querySet The result of the query in the form of a map of entity collections.
 * These are the entity data to merge into the respective collections.
 * @param mergeStrategy How to merge a queried entity when it is already in the collection.
 * The default is NxaMergeStrategy.PreserveChanges
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
export class NxaMergeQuerySet implements Action {
    readonly payload: {
        querySet: NxaEntityCacheQuerySet;
        mergeStrategy?: NxaMergeStrategy;
        tag?: string;
    };

    readonly type = NxaEntityCacheAction.MERGE_QUERY_SET;

    constructor(
        querySet: NxaEntityCacheQuerySet,
        mergeStrategy?: NxaMergeStrategy,
        tag?: string
    ) {
        this.payload = {
            querySet,
            mergeStrategy:
                mergeStrategy === null ? NxaMergeStrategy.PreserveChanges : mergeStrategy,
            tag,
        };
    }
}

/**
 * Create entity cache action for replacing the entire entity cache.
 * Dangerous because brute force but useful as when re-hydrating an NxaEntityCache
 * from local browser storage when the application launches.
 * @param cache New state of the entity cache
 * @param [tag] Optional tag to identify the operation from the app perspective.
 */
export class NxaSetEntityCache implements Action {
    readonly payload: { cache: NxaEntityCache; tag?: string };
    readonly type = NxaEntityCacheAction.SET_NXA_ENTITY_CACHE;

    constructor(public readonly cache: NxaEntityCache, tag?: string) {
        this.payload = { cache, tag };
    }
}

// #region NxaSaveEntities
export class NxaSaveEntities implements Action {
    readonly payload: {
        readonly NxaChangeSet: NxaChangeSet;
        readonly url: string;
        readonly correlationId?: any;
        readonly isOptimistic?: boolean;
        readonly mergeStrategy?: NxaMergeStrategy;
        readonly tag?: string;
        error?: Error;
        skip?: boolean; // not used
    };
    readonly type = NxaEntityCacheAction.SAVE_ENTITIES;

    constructor(
        NxaChangeSet: NxaChangeSet,
        url: string,
        options?: NxaEntityActionOptions
    ) {
        options = options || {};
        if (NxaChangeSet) {
            NxaChangeSet.tag = NxaChangeSet.tag || options.tag;
        }
        this.payload = { NxaChangeSet, url, ...options, tag: NxaChangeSet.tag };
    }
}

export class NxaSaveEntitiesCancel implements Action {
    readonly payload: {
        readonly correlationId: any;
        readonly reason?: string;
        readonly entityNames?: string[];
        readonly tag?: string;
    };
    readonly type = NxaEntityCacheAction.SAVE_ENTITIES_CANCEL;

    constructor(
        correlationId: any,
        reason?: string,
        entityNames?: string[],
        tag?: string
    ) {
        this.payload = { correlationId, reason, entityNames, tag };
    }
}

export class NxaSaveEntitiesCanceled implements Action {
    readonly payload: {
        readonly correlationId: any;
        readonly reason?: string;
        readonly tag?: string;
    };
    readonly type = NxaEntityCacheAction.SAVE_ENTITIES_CANCEL;

    constructor(correlationId: any, reason?: string, tag?: string) {
        this.payload = { correlationId, reason, tag };
    }
}

export class NxaSaveEntitiesError {
    readonly payload: {
        readonly error: NxaDataServiceError;
        readonly originalAction: NxaSaveEntities;
        readonly correlationId: any;
    };
    readonly type = NxaEntityCacheAction.SAVE_ENTITIES_ERROR;
    constructor(error: NxaDataServiceError, originalAction: NxaSaveEntities) {
        const correlationId = originalAction.payload.correlationId;
        this.payload = { error, originalAction, correlationId };
    }
}

export class NxaSaveEntitiesSuccess implements Action {
    readonly payload: {
        readonly NxaChangeSet: NxaChangeSet;
        readonly url: string;
        readonly correlationId?: any;
        readonly isOptimistic?: boolean;
        readonly mergeStrategy?: NxaMergeStrategy;
        readonly tag?: string;
        error?: Error;
        skip?: boolean; // not used
    };
    readonly type = NxaEntityCacheAction.SAVE_ENTITIES_SUCCESS;

    constructor(
        NxaChangeSet: NxaChangeSet,
        url: string,
        options?: NxaEntityActionOptions
    ) {
        options = options || {};
        if (NxaChangeSet) {
            NxaChangeSet.tag = NxaChangeSet.tag || options.tag;
        }
        this.payload = { NxaChangeSet, url, ...options, tag: NxaChangeSet.tag };
    }
}
// #endregion NxaSaveEntities