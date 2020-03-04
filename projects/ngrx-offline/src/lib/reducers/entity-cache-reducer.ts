import { Injectable } from '@angular/core';
import { Action, ActionReducer } from '@ngrx/store';

import { NxaEntityAction } from '../actions/entity-action';
import { NxaEntityCache } from './entity-cache';

import {
    NxaEntityCacheAction,
    NxaClearCollections,
    NxaLoadCollections,
    NxaMergeQuerySet,
    NxaSaveEntities,
    NxaSaveEntitiesCancel,
    NxaSaveEntitiesError,
    NxaSaveEntitiesSuccess,
} from '../actions/entity-cache-action';

import {
    NxaChangeSetOperation,
    NxaChangeSetItem,
} from '../actions/entity-cache-change-set';

import { NxaEntityCollection } from './entity-collection';
import { NxaEntityCollectionCreator } from './entity-collection-creator';
import { NxaEntityCollectionReducerRegistry } from './entity-collection-reducer-registry';
import { NxaEntityOp } from '../actions/entity-op';
import { Logger } from '../utils/interfaces';
import { NxaMergeStrategy } from '../actions/merge-strategy';

/**
 * Creates the NxaEntityCacheReducer via its create() method
 */
@Injectable()
export class NxaEntityCacheReducerFactory {
    constructor(
        private entityCollectionCreator: NxaEntityCollectionCreator,
        private entityCollectionReducerRegistry: NxaEntityCollectionReducerRegistry,
        private logger: Logger
    ) { }

    /**
     * Create the @@ngrx/action entity cache reducer which either responds to entity cache level actions
     * or (more commonly) delegates to an EntityCollectionReducer based on the action.payload.entityName.
     */
    create(): ActionReducer<NxaEntityCache, Action> {
        // This technique ensures a named function appears in the debugger
        return entityCacheReducer.bind(this);

        function entityCacheReducer(
            this: NxaEntityCacheReducerFactory,
            entityCache: NxaEntityCache = {},
            action: { type: string; payload?: any }
        ): NxaEntityCache {
            // NxaEntityCache actions
            switch (action.type) {
                case NxaEntityCacheAction.CLEAR_COLLECTIONS: {
                    return this.NxaClearCollectionsReducer(
                        entityCache,
                        action as NxaClearCollections
                    );
                }

                case NxaEntityCacheAction.LOAD_COLLECTIONS: {
                    return this.NxaLoadCollectionsReducer(
                        entityCache,
                        action as NxaLoadCollections
                    );
                }

                case NxaEntityCacheAction.MERGE_QUERY_SET: {
                    return this.NxaMergeQuerySetReducer(
                        entityCache,
                        action as NxaMergeQuerySet
                    );
                }

                case NxaEntityCacheAction.SAVE_ENTITIES: {
                    return this.NxaSaveEntitiesReducer(entityCache, action as NxaSaveEntities);
                }

                case NxaEntityCacheAction.SAVE_ENTITIES_CANCEL: {
                    return this.NxaSaveEntitiesCancelReducer(
                        entityCache,
                        action as NxaSaveEntitiesCancel
                    );
                }

                case NxaEntityCacheAction.SAVE_ENTITIES_ERROR: {
                    return this.NxaSaveEntitiesErrorReducer(
                        entityCache,
                        action as NxaSaveEntitiesError
                    );
                }

                case NxaEntityCacheAction.SAVE_ENTITIES_SUCCESS: {
                    return this.NxaSaveEntitiesSuccessReducer(
                        entityCache,
                        action as NxaSaveEntitiesSuccess
                    );
                }

                case NxaEntityCacheAction.SET_NXA_ENTITY_CACHE: {
                    // Completely replace the NxaEntityCache. Be careful!
                    return action.payload.cache;
                }
            }

            // Apply entity collection reducer if this is a valid NxaEntityAction for a collection
            const payload = action.payload;
            if (payload && payload.entityName && payload.entityOp && !payload.error) {
                return this.applyCollectionReducer(entityCache, action as NxaEntityAction);
            }

            // Not a valid NxaEntityAction
            return entityCache;
        }
    }

    /**
     * Reducer to clear multiple collections at the same time.
     * @param entityCache the entity cache
     * @param action a NxaClearCollections action whose payload is an array of collection names.
     * If empty array, does nothing. If no array, clears all the collections.
     */
    protected NxaClearCollectionsReducer(
        entityCache: NxaEntityCache,
        action: NxaClearCollections
    ) {
        // tslint:disable-next-line:prefer-const
        let { collections, tag } = action.payload;
        const entityOp = NxaEntityOp.REMOVE_ALL;

        if (!collections) {
            // Collections is not defined. Clear all collections.
            collections = Object.keys(entityCache);
        }

        entityCache = collections.reduce((newCache, entityName) => {
            const payload = { entityName, entityOp };
            const act: NxaEntityAction = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    }

    /**
     * Reducer to load collection in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a NxaLoadCollections action whose payload is the QuerySet of entity collections to load
     */
    protected NxaLoadCollectionsReducer(
        entityCache: NxaEntityCache,
        action: NxaLoadCollections
    ) {
        const { collections, tag } = action.payload;
        const entityOp = NxaEntityOp.ADD_ALL;
        const entityNames = Object.keys(collections);
        entityCache = entityNames.reduce((newCache, entityName) => {
            const payload = {
                entityName,
                entityOp,
                data: collections[entityName],
            };
            const act: NxaEntityAction = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    }

    /**
     * Reducer to merge query sets in the form of a hash of entity data for multiple collections.
     * @param entityCache the entity cache
     * @param action a NxaMergeQuerySet action with the query set and a NxaMergeStrategy
     */
    protected NxaMergeQuerySetReducer(
        entityCache: NxaEntityCache,
        action: NxaMergeQuerySet
    ) {
        // tslint:disable-next-line:prefer-const
        let { mergeStrategy, querySet, tag } = action.payload;
        mergeStrategy =
            mergeStrategy === null ? NxaMergeStrategy.PreserveChanges : mergeStrategy;
        const entityOp = NxaEntityOp.QUERY_MANY_SUCCESS;

        const entityNames = Object.keys(querySet);
        entityCache = entityNames.reduce((newCache, entityName) => {
            const payload = {
                entityName,
                entityOp,
                data: querySet[entityName],
                mergeStrategy,
            };
            const act: NxaEntityAction = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            newCache = this.applyCollectionReducer(newCache, act);
            return newCache;
        }, entityCache);
        return entityCache;
    }

    // #region NxaSaveEntities reducers
    protected NxaSaveEntitiesReducer(
        entityCache: NxaEntityCache,
        action: NxaSaveEntities
    ) {
        const {
            NxaChangeSet,
            correlationId,
            isOptimistic,
            mergeStrategy,
            tag,
        } = action.payload;

        try {
            NxaChangeSet.changes.forEach(item => {
                const entityName = item.entityName;
                const payload = {
                    entityName,
                    entityOp: getNxaEntityOp(item),
                    data: item.entities,
                    correlationId,
                    isOptimistic,
                    mergeStrategy,
                    tag,
                };

                const act: NxaEntityAction = {
                    type: `[${entityName}] ${action.type}`,
                    payload,
                };
                entityCache = this.applyCollectionReducer(entityCache, act);
                if (act.payload.error) {
                    throw act.payload.error;
                }
            });
        } catch (error) {
            action.payload.error = error;
        }

        return entityCache;
        function getNxaEntityOp(item: NxaChangeSetItem) {
            switch (item.op) {
                case NxaChangeSetOperation.Add:
                    return NxaEntityOp.SAVE_ADD_MANY;
                case NxaChangeSetOperation.Delete:
                    return NxaEntityOp.SAVE_DELETE_MANY;
                case NxaChangeSetOperation.Update:
                    return NxaEntityOp.SAVE_UPDATE_MANY;
                case NxaChangeSetOperation.Upsert:
                    return NxaEntityOp.SAVE_UPSERT_MANY;
            }
        }
    }

    protected NxaSaveEntitiesCancelReducer(
        entityCache: NxaEntityCache,
        action: NxaSaveEntitiesCancel
    ) {
        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        return this.clearLoadingFlags(
            entityCache,
            action.payload.entityNames || []
        );
    }

    protected NxaSaveEntitiesErrorReducer(
        entityCache: NxaEntityCache,
        action: NxaSaveEntitiesError
    ) {
        const originalAction = action.payload.originalAction;
        const originalNxaChangeSet = originalAction.payload.NxaChangeSet;

        // This implementation can only clear the loading flag for the collections involved
        // If the save was optimistic, you'll have to compensate to fix the cache as you think necessary
        const entityNames = originalNxaChangeSet.changes.map(item => item.entityName);
        return this.clearLoadingFlags(entityCache, entityNames);
    }

    protected NxaSaveEntitiesSuccessReducer(
        entityCache: NxaEntityCache,
        action: NxaSaveEntitiesSuccess
    ) {
        const {
            NxaChangeSet,
            correlationId,
            isOptimistic,
            mergeStrategy,
            tag,
        } = action.payload;

        NxaChangeSet.changes.forEach(item => {
            const entityName = item.entityName;
            const payload = {
                entityName,
                entityOp: getNxaEntityOp(item),
                data: item.entities,
                correlationId,
                isOptimistic,
                mergeStrategy,
                tag,
            };

            const act: NxaEntityAction = {
                type: `[${entityName}] ${action.type}`,
                payload,
            };
            entityCache = this.applyCollectionReducer(entityCache, act);
        });

        return entityCache;
        function getNxaEntityOp(item: NxaChangeSetItem) {
            switch (item.op) {
                case NxaChangeSetOperation.Add:
                    return NxaEntityOp.SAVE_ADD_MANY_SUCCESS;
                case NxaChangeSetOperation.Delete:
                    return NxaEntityOp.SAVE_DELETE_MANY_SUCCESS;
                case NxaChangeSetOperation.Update:
                    return NxaEntityOp.SAVE_UPDATE_MANY_SUCCESS;
                case NxaChangeSetOperation.Upsert:
                    return NxaEntityOp.SAVE_UPSERT_MANY_SUCCESS;
            }
        }
    }
    // #endregion NxaSaveEntities reducers

    // #region helpers
    /** Apply reducer for the action's EntityCollection (if the action targets a collection) */
    private applyCollectionReducer(
        cache: NxaEntityCache = {},
        action: NxaEntityAction
    ) {
        const entityName = action.payload.entityName;
        const collection = cache[entityName];
        const reducer = this.entityCollectionReducerRegistry.getOrCreateReducer(
            entityName
        );

        let newCollection: NxaEntityCollection;
        try {
            newCollection = collection
                ? reducer(collection, action)
                : reducer(this.entityCollectionCreator.create(entityName), action);
        } catch (error) {
            this.logger.error(error);
            action.payload.error = error;
        }

        return action.payload.error || collection === newCollection!
            ? cache
            : { ...cache, [entityName]: newCollection! };
    }

    /** Ensure loading is false for every collection in entityNames */
    private clearLoadingFlags(entityCache: NxaEntityCache, entityNames: string[]) {
        let isMutated = false;
        entityNames.forEach(entityName => {
            const collection = entityCache[entityName];
            if (collection.loading) {
                if (!isMutated) {
                    entityCache = { ...entityCache };
                    isMutated = true;
                }
                entityCache[entityName] = { ...collection, loading: false };
            }
        });
        return entityCache;
    }
    // #endregion helpers
}