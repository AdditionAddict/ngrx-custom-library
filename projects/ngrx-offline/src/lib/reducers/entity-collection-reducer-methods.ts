import { Injectable } from '@angular/core';
import { EntityAdapter, IdSelector, Update } from '@ngrx/entity';
import {
    NxaChangeStateMap,
    NxaChangeType,
    NxaEntityCollection,
} from './entity-collection';
import { NxaEntityChangeTrackerBase } from './entity-change-tracker-base';
import { toUpdateFactory } from '../utils/utilities';
import { NxaEntityAction } from '../actions/entity-action';
import { NxaEntityActionDataServiceError } from '../dataservices/data-service-error';
import { NxaEntityActionGuard } from '../actions/entity-action-guard';
import { NxaEntityChangeTracker } from './entity-change-tracker';
import { NxaEntityDefinition } from '../entity-metadata/entity-definition';
import { NxaEntityDefinitionService } from '../entity-metadata/entity-definition.service';
import { NxaEntityOp } from '../actions/entity-op';
import { NxaMergeStrategy } from '../actions/merge-strategy';
import { NxaUpdateResponseData } from '../actions/update-response-data';

/**
 * Map of {NxaEntityOp} to reducer method for the operation.
 * If an operation is missing, caller should return the collection for that reducer.
 */
export interface NxaEntityCollectionReducerMethodMap<T> {
    [method: string]: (
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction
    ) => NxaEntityCollection<T>;
}

/**
 * Base implementation of reducer methods for an entity collection.
 */
export class NxaEntityCollectionReducerMethods<T> {
    protected adapter: EntityAdapter<T>;
    protected guard: NxaEntityActionGuard<T>;
    /** True if this collection tracks unsaved changes */
    protected isChangeTracking: boolean;

    /** Extract the primary key (id); default to `id` */
    selectId: IdSelector<T>;

    /**
     * Track changes to entities since the last query or save
     * Can revert some or all of those changes
     */
    entityChangeTracker: NxaEntityChangeTracker<T>;

    /**
     * Convert an entity (or partial entity) into the `Update<T>` object
     * `id`: the primary key and
     * `changes`: the entity (or partial entity of changes).
     */
    protected toUpdate: (entity: Partial<T>) => Update<T>;

    /**
     * Dictionary of the {NxaEntityCollectionReducerMethods} for this entity type,
     * keyed by the {NxaEntityOp}
     */
    readonly methods: NxaEntityCollectionReducerMethodMap<T> = {
        [NxaEntityOp.CANCEL_PERSIST]: this.cancelPersist.bind(this),

        [NxaEntityOp.QUERY_ALL]: this.queryAll.bind(this),
        [NxaEntityOp.QUERY_ALL_ERROR]: this.queryAllError.bind(this),
        [NxaEntityOp.QUERY_ALL_SUCCESS]: this.queryAllSuccess.bind(this),

        [NxaEntityOp.QUERY_BY_KEY]: this.queryByKey.bind(this),
        [NxaEntityOp.QUERY_BY_KEY_ERROR]: this.queryByKeyError.bind(this),
        [NxaEntityOp.QUERY_BY_KEY_SUCCESS]: this.queryByKeySuccess.bind(this),

        [NxaEntityOp.QUERY_LOAD]: this.queryLoad.bind(this),
        [NxaEntityOp.QUERY_LOAD_ERROR]: this.queryLoadError.bind(this),
        [NxaEntityOp.QUERY_LOAD_SUCCESS]: this.queryLoadSuccess.bind(this),

        [NxaEntityOp.QUERY_MANY]: this.queryMany.bind(this),
        [NxaEntityOp.QUERY_MANY_ERROR]: this.queryManyError.bind(this),
        [NxaEntityOp.QUERY_MANY_SUCCESS]: this.queryManySuccess.bind(this),

        [NxaEntityOp.SAVE_ADD_MANY]: this.saveAddMany.bind(this),
        [NxaEntityOp.SAVE_ADD_MANY_ERROR]: this.saveAddManyError.bind(this),
        [NxaEntityOp.SAVE_ADD_MANY_SUCCESS]: this.saveAddManySuccess.bind(this),

        [NxaEntityOp.SAVE_ADD_ONE]: this.saveAddOne.bind(this),
        [NxaEntityOp.SAVE_ADD_ONE_ERROR]: this.saveAddOneError.bind(this),
        [NxaEntityOp.SAVE_ADD_ONE_SUCCESS]: this.saveAddOneSuccess.bind(this),

        [NxaEntityOp.SAVE_DELETE_MANY]: this.saveDeleteMany.bind(this),
        [NxaEntityOp.SAVE_DELETE_MANY_ERROR]: this.saveDeleteManyError.bind(this),
        [NxaEntityOp.SAVE_DELETE_MANY_SUCCESS]: this.saveDeleteManySuccess.bind(this),

        [NxaEntityOp.SAVE_DELETE_ONE]: this.saveDeleteOne.bind(this),
        [NxaEntityOp.SAVE_DELETE_ONE_ERROR]: this.saveDeleteOneError.bind(this),
        [NxaEntityOp.SAVE_DELETE_ONE_SUCCESS]: this.saveDeleteOneSuccess.bind(this),

        [NxaEntityOp.SAVE_UPDATE_MANY]: this.saveUpdateMany.bind(this),
        [NxaEntityOp.SAVE_UPDATE_MANY_ERROR]: this.saveUpdateManyError.bind(this),
        [NxaEntityOp.SAVE_UPDATE_MANY_SUCCESS]: this.saveUpdateManySuccess.bind(this),

        [NxaEntityOp.SAVE_UPDATE_ONE]: this.saveUpdateOne.bind(this),
        [NxaEntityOp.SAVE_UPDATE_ONE_ERROR]: this.saveUpdateOneError.bind(this),
        [NxaEntityOp.SAVE_UPDATE_ONE_SUCCESS]: this.saveUpdateOneSuccess.bind(this),

        [NxaEntityOp.SAVE_UPSERT_MANY]: this.saveUpsertMany.bind(this),
        [NxaEntityOp.SAVE_UPSERT_MANY_ERROR]: this.saveUpsertManyError.bind(this),
        [NxaEntityOp.SAVE_UPSERT_MANY_SUCCESS]: this.saveUpsertManySuccess.bind(this),

        [NxaEntityOp.SAVE_UPSERT_ONE]: this.saveUpsertOne.bind(this),
        [NxaEntityOp.SAVE_UPSERT_ONE_ERROR]: this.saveUpsertOneError.bind(this),
        [NxaEntityOp.SAVE_UPSERT_ONE_SUCCESS]: this.saveUpsertOneSuccess.bind(this),

        // Do nothing on save errors except turn the loading flag off.
        // See the ChangeTrackerMetaReducers
        // Or the app could listen for those errors and do something

        /// cache only operations ///

        [NxaEntityOp.ADD_ALL]: this.addAll.bind(this),
        [NxaEntityOp.ADD_MANY]: this.addMany.bind(this),
        [NxaEntityOp.ADD_ONE]: this.addOne.bind(this),

        [NxaEntityOp.REMOVE_ALL]: this.removeAll.bind(this),
        [NxaEntityOp.REMOVE_MANY]: this.removeMany.bind(this),
        [NxaEntityOp.REMOVE_ONE]: this.removeOne.bind(this),

        [NxaEntityOp.UPDATE_MANY]: this.updateMany.bind(this),
        [NxaEntityOp.UPDATE_ONE]: this.updateOne.bind(this),

        [NxaEntityOp.UPSERT_MANY]: this.upsertMany.bind(this),
        [NxaEntityOp.UPSERT_ONE]: this.upsertOne.bind(this),

        [NxaEntityOp.COMMIT_ALL]: this.commitAll.bind(this),
        [NxaEntityOp.COMMIT_MANY]: this.commitMany.bind(this),
        [NxaEntityOp.COMMIT_ONE]: this.commitOne.bind(this),
        [NxaEntityOp.UNDO_ALL]: this.undoAll.bind(this),
        [NxaEntityOp.UNDO_MANY]: this.undoMany.bind(this),
        [NxaEntityOp.UNDO_ONE]: this.undoOne.bind(this),

        [NxaEntityOp.SET_CHANGE_STATE]: this.setNxaChangeState.bind(this),
        [NxaEntityOp.SET_COLLECTION]: this.setCollection.bind(this),
        [NxaEntityOp.SET_FILTER]: this.setFilter.bind(this),
        [NxaEntityOp.SET_LOADED]: this.setLoaded.bind(this),
        [NxaEntityOp.SET_LOADING]: this.setLoading.bind(this),
    };

    constructor(
        public entityName: string,
        public definition: NxaEntityDefinition<T>,
        /*
         * Track changes to entities since the last query or save
         * Can revert some or all of those changes
         */
        entityChangeTracker?: NxaEntityChangeTracker<T>
    ) {
        this.adapter = definition.entityAdapter;
        this.isChangeTracking = definition.noChangeTracking !== true;
        this.selectId = definition.selectId;

        this.guard = new NxaEntityActionGuard(entityName, this.selectId);
        this.toUpdate = toUpdateFactory(this.selectId);

        this.entityChangeTracker =
            entityChangeTracker ||
            new NxaEntityChangeTrackerBase<T>(this.adapter, this.selectId);
    }

    /** Cancel a persistence operation */
    protected cancelPersist(
        collection: NxaEntityCollection<T>
    ): NxaEntityCollection<T> {
        return this.setLoadingFalse(collection);
    }

    // #region query operations

    protected queryAll(collection: NxaEntityCollection<T>): NxaEntityCollection<T> {
        return this.setLoadingTrue(collection);
    }

    protected queryAllError(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaEntityActionDataServiceError>
    ): NxaEntityCollection<T> {
        return this.setLoadingFalse(collection);
    }

    /**
     * Merges query results per the NxaMergeStrategy
     * Sets loading flag to false and loaded flag to true.
     */
    protected queryAllSuccess(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T[]>
    ): NxaEntityCollection<T> {
        const data = this.extractData(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        return {
            ...this.entityChangeTracker.mergeQueryResults(
                data,
                collection,
                mergeStrategy
            ),
            loaded: true,
            loading: false,
        };
    }

    protected queryByKey(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<number | string>
    ): NxaEntityCollection<T> {
        return this.setLoadingTrue(collection);
    }

    protected queryByKeyError(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaEntityActionDataServiceError>
    ): NxaEntityCollection<T> {
        return this.setLoadingFalse(collection);
    }

    protected queryByKeySuccess(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T>
    ): NxaEntityCollection<T> {
        const data = this.extractData(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        collection =
            data == null
                ? collection
                : this.entityChangeTracker.mergeQueryResults(
                    [data],
                    collection,
                    mergeStrategy
                );
        return this.setLoadingFalse(collection);
    }

    protected queryLoad(collection: NxaEntityCollection<T>): NxaEntityCollection<T> {
        return this.setLoadingTrue(collection);
    }

    protected queryLoadError(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaEntityActionDataServiceError>
    ): NxaEntityCollection<T> {
        return this.setLoadingFalse(collection);
    }

    /**
     * Replaces all entities in the collection
     * Sets loaded flag to true, loading flag to false,
     * and clears changeState for the entire collection.
     */
    protected queryLoadSuccess(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T[]>
    ): NxaEntityCollection<T> {
        const data = this.extractData(action);
        return {
            ...this.adapter.addAll(data, collection),
            loading: false,
            loaded: true,
            changeState: {},
        };
    }

    protected queryMany(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction
    ): NxaEntityCollection<T> {
        return this.setLoadingTrue(collection);
    }

    protected queryManyError(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaEntityActionDataServiceError>
    ): NxaEntityCollection<T> {
        return this.setLoadingFalse(collection);
    }

    protected queryManySuccess(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T[]>
    ): NxaEntityCollection<T> {
        const data = this.extractData(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        return {
            ...this.entityChangeTracker.mergeQueryResults(
                data,
                collection,
                mergeStrategy
            ),
            loading: false,
        };
    }
    // #endregion query operations

    // #region save operations

    // #region saveAddMany
    /**
     * Save multiple new entities.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add immediately.
     * @param collection The collection to which the entities should be added.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of entities.
     * If saving optimistically, the entities must have their keys.
     */
    protected saveAddMany(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T[]>
    ): NxaEntityCollection<T> {
        if (this.isOptimistic(action)) {
            const entities = this.guard.mustBeEntities(action); // ensure the entity has a PK
            const mergeStrategy = this.extractNxaMergeStrategy(action);
            collection = this.entityChangeTracker.trackAddMany(
                entities,
                collection,
                mergeStrategy
            );
            collection = this.adapter.addMany(entities, collection);
        }
        return this.setLoadingTrue(collection);
    }

    /**
     * Attempt to save new entities failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new entities are not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    protected saveAddManyError(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaEntityActionDataServiceError>
    ): NxaEntityCollection<T> {
        return this.setLoadingFalse(collection);
    }
    // #endregion saveAddMany

    // #region saveAddOne
    /**
     * Successfully saved new entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field),
     * and may even return additional new entities.
     * Therefore, upsert the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     * Note: saveAddManySuccess differs from saveAddOneSuccess when optimistic.
     * saveAddOneSuccess updates (not upserts) with the lone entity from the server.
     * There is no effect if the entity is not already in cache.
     * saveAddManySuccess will add an entity if it is not found in cache.
     */
    protected saveAddManySuccess(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T[]>
    ) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        const entities = this.guard.mustBeEntities(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        if (this.isOptimistic(action)) {
            collection = this.entityChangeTracker.mergeSaveUpserts(
                entities,
                collection,
                mergeStrategy
            );
        } else {
            collection = this.entityChangeTracker.mergeSaveAdds(
                entities,
                collection,
                mergeStrategy
            );
        }
        return this.setLoadingFalse(collection);
    }
    // #endregion saveAddMany

    // #region saveAddOne
    /**
     * Save a new entity.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add entity immediately.
     * @param collection The collection to which the entity should be added.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an entity.
     * If saving optimistically, the entity must have a key.
     */
    protected saveAddOne(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T>
    ): NxaEntityCollection<T> {
        if (this.isOptimistic(action)) {
            const entity = this.guard.mustBeEntity(action); // ensure the entity has a PK
            const mergeStrategy = this.extractNxaMergeStrategy(action);
            collection = this.entityChangeTracker.trackAddOne(
                entity,
                collection,
                mergeStrategy
            );
            collection = this.adapter.addOne(entity, collection);
        }
        return this.setLoadingTrue(collection);
    }

    /**
     * Attempt to save a new entity failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity is not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entity is in the collection and
     * you may need to compensate for the error.
     */
    protected saveAddOneError(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaEntityActionDataServiceError>
    ): NxaEntityCollection<T> {
        return this.setLoadingFalse(collection);
    }

    /**
     * Successfully saved a new entity to the server.
     * If saved pessimistically, add the entity from the server to the collection.
     * If saved optimistically, the added entity is already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entity in the collection with the returned value (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    protected saveAddOneSuccess(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T>
    ) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        const entity = this.guard.mustBeEntity(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        if (this.isOptimistic(action)) {
            const update: NxaUpdateResponseData<T> = this.toUpdate(entity);
            // Always update the cache with added entity returned from server
            collection = this.entityChangeTracker.mergeSaveUpdates(
                [update],
                collection,
                mergeStrategy,
                false /*never skip*/
            );
        } else {
            collection = this.entityChangeTracker.mergeSaveAdds(
                [entity],
                collection,
                mergeStrategy
            );
        }
        return this.setLoadingFalse(collection);
    }
    // #endregion saveAddOne

    // #region saveAddMany
    // TODO MANY
    // #endregion saveAddMany

    // #region saveDeleteOne
    /**
     * Delete an entity from the server by key and remove it from the collection (if present).
     * If the entity is an unsaved new entity, remove it from the collection immediately
     * and skip the server delete request.
     * An optimistic save removes an existing entity from the collection immediately;
     * a pessimistic save removes it after the server confirms successful delete.
     * @param collection Will remove the entity with this key from the collection.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be a primary key or an entity with a key;
     * this reducer extracts the key from the entity.
     */
    protected saveDeleteOne(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<number | string | T>
    ): NxaEntityCollection<T> {
        const toDelete = this.extractData(action);
        const deleteId =
            typeof toDelete === 'object'
                ? this.selectId(toDelete)
                : (toDelete as string | number);
        const change = collection.changeState[deleteId];
        // If entity is already tracked ...
        if (change) {
            if (change.changeType === NxaChangeType.Added) {
                // Remove the added entity immediately and forget about its changes (via commit).
                collection = this.adapter.removeOne(deleteId as string, collection);
                collection = this.entityChangeTracker.commitOne(deleteId, collection);
                // Should not waste effort trying to delete on the server because it can't be there.
                action.payload.skip = true;
            } else {
                // Re-track it as a delete, even if tracking is turned off for this call.
                collection = this.entityChangeTracker.trackDeleteOne(
                    deleteId,
                    collection
                );
            }
        }

        // If optimistic delete, track current state and remove immediately.
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractNxaMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteOne(
                deleteId,
                collection,
                mergeStrategy
            );
            collection = this.adapter.removeOne(deleteId as string, collection);
        }

        return this.setLoadingTrue(collection);
    }

    /**
     * Attempt to delete the entity on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity could still be in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the entity is not in the collection and
     * you may need to compensate for the error.
     */
    protected saveDeleteOneError(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaEntityActionDataServiceError>
    ): NxaEntityCollection<T> {
        return this.setLoadingFalse(collection);
    }

    /**
     * Successfully deleted entity on the server. The key of the deleted entity is in the action payload data.
     * If saved pessimistically, if the entity is still in the collection it will be removed.
     * If saved optimistically, the entity has already been removed from the collection.
     */
    protected saveDeleteOneSuccess(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<number | string>
    ): NxaEntityCollection<T> {
        const deleteId = this.extractData(action);
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractNxaMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveDeletes(
                [deleteId],
                collection,
                mergeStrategy
            );
        } else {
            // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
            collection = this.adapter.removeOne(deleteId as string, collection);
            collection = this.entityChangeTracker.commitOne(deleteId, collection);
        }
        return this.setLoadingFalse(collection);
    }
    // #endregion saveDeleteOne

    // #region saveDeleteMany
    /**
     * Delete multiple entities from the server by key and remove them from the collection (if present).
     * Removes unsaved new entities from the collection immediately
     * but the id is still sent to the server for deletion even though the server will not find that entity.
     * Therefore, the server must be willing to ignore a delete request for an entity it cannot find.
     * An optimistic save removes existing entities from the collection immediately;
     * a pessimistic save removes them after the server confirms successful delete.
     * @param collection Removes entities from this collection.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of primary keys or entities with a key;
     * this reducer extracts the key from the entity.
     */
    protected saveDeleteMany(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<(number | string | T)[]>
    ): NxaEntityCollection<T> {
        const deleteIds = this.extractData(action).map(
            d => (typeof d === 'object' ? this.selectId(d) : (d as string | number))
        );
        deleteIds.forEach(deleteId => {
            const change = collection.changeState[deleteId];
            // If entity is already tracked ...
            if (change) {
                if (change.changeType === NxaChangeType.Added) {
                    // Remove the added entity immediately and forget about its changes (via commit).
                    collection = this.adapter.removeOne(deleteId as string, collection);
                    collection = this.entityChangeTracker.commitOne(deleteId, collection);
                    // Should not waste effort trying to delete on the server because it can't be there.
                    action.payload.skip = true;
                } else {
                    // Re-track it as a delete, even if tracking is turned off for this call.
                    collection = this.entityChangeTracker.trackDeleteOne(
                        deleteId,
                        collection
                    );
                }
            }
        });
        // If optimistic delete, track current state and remove immediately.
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractNxaMergeStrategy(action);
            collection = this.entityChangeTracker.trackDeleteMany(
                deleteIds,
                collection,
                mergeStrategy
            );
            collection = this.adapter.removeMany(deleteIds as string[], collection);
        }
        return this.setLoadingTrue(collection);
    }

    /**
     * Attempt to delete the entities on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entities could still be in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the entities are not in the collection and
     * you may need to compensate for the error.
     */
    protected saveDeleteManyError(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaEntityActionDataServiceError>
    ): NxaEntityCollection<T> {
        return this.setLoadingFalse(collection);
    }

    /**
     * Successfully deleted entities on the server. The keys of the deleted entities are in the action payload data.
     * If saved pessimistically, entities that are still in the collection will be removed.
     * If saved optimistically, the entities have already been removed from the collection.
     */
    protected saveDeleteManySuccess(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<(number | string)[]>
    ): NxaEntityCollection<T> {
        const deleteIds = this.extractData(action);
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractNxaMergeStrategy(action);
            collection = this.entityChangeTracker.mergeSaveDeletes(
                deleteIds,
                collection,
                mergeStrategy
            );
        } else {
            // Pessimistic: ignore mergeStrategy. Remove entity from the collection and from change tracking.
            collection = this.adapter.removeMany(deleteIds as string[], collection);
            collection = this.entityChangeTracker.commitMany(deleteIds, collection);
        }
        return this.setLoadingFalse(collection);
    }
    // #endregion saveDeleteMany

    // #region saveUpdateOne
    /**
     * Save an update to an existing entity.
     * If saving pessimistically, update the entity in the collection after the server confirms success.
     * If saving optimistically, update the entity immediately, before the save request.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an {Update<T>}
     */
    protected saveUpdateOne(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<Update<T>>
    ): NxaEntityCollection<T> {
        const update = this.guard.mustBeUpdate(action);
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractNxaMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpdateOne(
                update,
                collection,
                mergeStrategy
            );
            collection = this.adapter.updateOne(update, collection);
        }
        return this.setLoadingTrue(collection);
    }

    /**
     * Attempt to update the entity on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entity in the collection is in the pre-save state
     * you may not have to compensate for the error.
     * If saved optimistically, the entity in the collection was updated
     * and you may need to compensate for the error.
     */
    protected saveUpdateOneError(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaEntityActionDataServiceError>
    ): NxaEntityCollection<T> {
        return this.setLoadingFalse(collection);
    }

    /**
     * Successfully saved the updated entity to the server.
     * If saved pessimistically, update the entity in the collection with data from the server.
     * If saved optimistically, the entity was already updated in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entity in the collection with the returned value (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic update to avoid this risk.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic, and
     * the update data which, must be an UpdateResponse<T> that corresponds to the Update sent to the server.
     * You must include an UpdateResponse even if the save was optimistic,
     * to ensure that the change tracking is properly reset.
     */
    protected saveUpdateOneSuccess(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaUpdateResponseData<T>>
    ): NxaEntityCollection<T> {
        const update = this.guard.mustBeUpdateResponse(action);
        const isOptimistic = this.isOptimistic(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        collection = this.entityChangeTracker.mergeSaveUpdates(
            [update],
            collection,
            mergeStrategy,
            isOptimistic /*skip unchanged if optimistic */
        );
        return this.setLoadingFalse(collection);
    }
    // #endregion saveUpdateOne

    // #region saveUpdateMany
    /**
     * Save updated entities.
     * If saving pessimistically, update the entities in the collection after the server confirms success.
     * If saving optimistically, update the entities immediately, before the save request.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an array of {Update<T>}.
     */
    protected saveUpdateMany(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<Update<T>[]>
    ): NxaEntityCollection<T> {
        const updates = this.guard.mustBeUpdates(action);
        if (this.isOptimistic(action)) {
            const mergeStrategy = this.extractNxaMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpdateMany(
                updates,
                collection,
                mergeStrategy
            );
            collection = this.adapter.updateMany(updates, collection);
        }
        return this.setLoadingTrue(collection);
    }

    /**
     * Attempt to update entities on the server failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, the entities in the collection are in the pre-save state
     * you may not have to compensate for the error.
     * If saved optimistically, the entities in the collection were updated
     * and you may need to compensate for the error.
     */
    protected saveUpdateManyError(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaEntityActionDataServiceError>
    ): NxaEntityCollection<T> {
        return this.setLoadingFalse(collection);
    }

    /**
     * Successfully saved the updated entities to the server.
     * If saved pessimistically, the entities in the collection will be updated with data from the server.
     * If saved optimistically, the entities in the collection were already updated.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entity in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic update to avoid this risk.
     * @param collection The collection to update
     * @param action The action payload holds options, including if the save is optimistic,
     * and the data which, must be an array of UpdateResponse<T>.
     * You must include an UpdateResponse for every Update sent to the server,
     * even if the save was optimistic, to ensure that the change tracking is properly reset.
     */
    protected saveUpdateManySuccess(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaUpdateResponseData<T>[]>
    ): NxaEntityCollection<T> {
        const updates = this.guard.mustBeUpdateResponses(action);
        const isOptimistic = this.isOptimistic(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        collection = this.entityChangeTracker.mergeSaveUpdates(
            updates,
            collection,
            mergeStrategy,
            false /* never skip */
        );
        return this.setLoadingFalse(collection);
    }
    // #endregion saveUpdateMany

    // #region saveUpsertOne
    /**
     * Save a new or existing entity.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add immediately.
     * @param collection The collection to which the entity should be upserted.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be a whole entity.
     * If saving optimistically, the entity must have its key.
     */
    protected saveUpsertOne(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T>
    ): NxaEntityCollection<T> {
        if (this.isOptimistic(action)) {
            const entity = this.guard.mustBeEntity(action); // ensure the entity has a PK
            const mergeStrategy = this.extractNxaMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpsertOne(
                entity,
                collection,
                mergeStrategy
            );
            collection = this.adapter.upsertOne(entity, collection);
        }
        return this.setLoadingTrue(collection);
    }

    /**
     * Attempt to save new or existing entity failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new or updated entity is not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    protected saveUpsertOneError(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaEntityActionDataServiceError>
    ): NxaEntityCollection<T> {
        return this.setLoadingFalse(collection);
    }

    /**
     * Successfully saved new or existing entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    protected saveUpsertOneSuccess(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T>
    ) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        const entity = this.guard.mustBeEntity(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        // Always update the cache with upserted entities returned from server
        collection = this.entityChangeTracker.mergeSaveUpserts(
            [entity],
            collection,
            mergeStrategy
        );
        return this.setLoadingFalse(collection);
    }
    // #endregion saveUpsertOne

    // #region saveUpsertMany
    /**
     * Save multiple new or existing entities.
     * If saving pessimistically, delay adding to collection until server acknowledges success.
     * If saving optimistically; add immediately.
     * @param collection The collection to which the entities should be upserted.
     * @param action The action payload holds options, including whether the save is optimistic,
     * and the data, which must be an array of whole entities.
     * If saving optimistically, the entities must have their keys.
     */
    protected saveUpsertMany(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T[]>
    ): NxaEntityCollection<T> {
        if (this.isOptimistic(action)) {
            const entities = this.guard.mustBeEntities(action); // ensure the entity has a PK
            const mergeStrategy = this.extractNxaMergeStrategy(action);
            collection = this.entityChangeTracker.trackUpsertMany(
                entities,
                collection,
                mergeStrategy
            );
            collection = this.adapter.upsertMany(entities, collection);
        }
        return this.setLoadingTrue(collection);
    }

    /**
     * Attempt to save new or existing entities failed or timed-out.
     * Action holds the error.
     * If saved pessimistically, new entities are not in the collection and
     * you may not have to compensate for the error.
     * If saved optimistically, the unsaved entities are in the collection and
     * you may need to compensate for the error.
     */
    protected saveUpsertManyError(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaEntityActionDataServiceError>
    ): NxaEntityCollection<T> {
        return this.setLoadingFalse(collection);
    }

    /**
     * Successfully saved new or existing entities to the server.
     * If saved pessimistically, add the entities from the server to the collection.
     * If saved optimistically, the added entities are already in the collection.
     * However, the server might have set or modified other fields (e.g, concurrency field)
     * Therefore, update the entities in the collection with the returned values (if any)
     * Caution: in a race, this update could overwrite unsaved user changes.
     * Use pessimistic add to avoid this risk.
     */
    protected saveUpsertManySuccess(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T[]>
    ) {
        // For pessimistic save, ensure the server generated the primary key if the client didn't send one.
        const entities = this.guard.mustBeEntities(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        // Always update the cache with upserted entities returned from server
        collection = this.entityChangeTracker.mergeSaveUpserts(
            entities,
            collection,
            mergeStrategy
        );
        return this.setLoadingFalse(collection);
    }
    // #endregion saveUpsertMany

    // #endregion save operations

    // #region cache-only operations

    /**
     * Replaces all entities in the collection
     * Sets loaded flag to true.
     * Merges query results, preserving unsaved changes
     */
    protected addAll(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T[]>
    ): NxaEntityCollection<T> {
        const entities = this.guard.mustBeEntities(action);
        return {
            ...this.adapter.addAll(entities, collection),
            loading: false,
            loaded: true,
            changeState: {},
        };
    }

    protected addMany(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T[]>
    ): NxaEntityCollection<T> {
        const entities = this.guard.mustBeEntities(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        collection = this.entityChangeTracker.trackAddMany(
            entities,
            collection,
            mergeStrategy
        );
        return this.adapter.addMany(entities, collection);
    }

    protected addOne(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T>
    ): NxaEntityCollection<T> {
        const entity = this.guard.mustBeEntity(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        collection = this.entityChangeTracker.trackAddOne(
            entity,
            collection,
            mergeStrategy
        );
        return this.adapter.addOne(entity, collection);
    }

    protected removeMany(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<number[] | string[]>
    ): NxaEntityCollection<T> {
        // payload must be entity keys
        const keys = this.guard.mustBeKeys(action) as string[];
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        collection = this.entityChangeTracker.trackDeleteMany(
            keys,
            collection,
            mergeStrategy
        );
        return this.adapter.removeMany(keys, collection);
    }

    protected removeOne(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<number | string>
    ): NxaEntityCollection<T> {
        // payload must be entity key
        const key = this.guard.mustBeKey(action) as string;
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        collection = this.entityChangeTracker.trackDeleteOne(
            key,
            collection,
            mergeStrategy
        );
        return this.adapter.removeOne(key, collection);
    }

    protected removeAll(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T>
    ): NxaEntityCollection<T> {
        return {
            ...this.adapter.removeAll(collection),
            loaded: false, // Only REMOVE_ALL sets loaded to false
            loading: false,
            changeState: {}, // Assume clearing the collection and not trying to delete all entities
        };
    }

    protected updateMany(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<Update<T>[]>
    ): NxaEntityCollection<T> {
        // payload must be an array of `Updates<T>`, not entities
        const updates = this.guard.mustBeUpdates(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpdateMany(
            updates,
            collection,
            mergeStrategy
        );
        return this.adapter.updateMany(updates, collection);
    }

    protected updateOne(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<Update<T>>
    ): NxaEntityCollection<T> {
        // payload must be an `Update<T>`, not an entity
        const update = this.guard.mustBeUpdate(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpdateOne(
            update,
            collection,
            mergeStrategy
        );
        return this.adapter.updateOne(update, collection);
    }

    protected upsertMany(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T[]>
    ): NxaEntityCollection<T> {
        // <v6: payload must be an array of `Updates<T>`, not entities
        // v6+: payload must be an array of T
        const entities = this.guard.mustBeEntities(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpsertMany(
            entities,
            collection,
            mergeStrategy
        );
        return this.adapter.upsertMany(entities, collection);
    }

    protected upsertOne(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T>
    ): NxaEntityCollection<T> {
        // <v6: payload must be an `Update<T>`, not an entity
        // v6+: payload must be a T
        const entity = this.guard.mustBeEntity(action);
        const mergeStrategy = this.extractNxaMergeStrategy(action);
        collection = this.entityChangeTracker.trackUpsertOne(
            entity,
            collection,
            mergeStrategy
        );
        return this.adapter.upsertOne(entity, collection);
    }

    protected commitAll(collection: NxaEntityCollection<T>) {
        return this.entityChangeTracker.commitAll(collection);
    }

    protected commitMany(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T[]>
    ) {
        return this.entityChangeTracker.commitMany(
            this.extractData(action),
            collection
        );
    }

    protected commitOne(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T>
    ) {
        return this.entityChangeTracker.commitOne(
            this.extractData(action),
            collection
        );
    }

    protected undoAll(collection: NxaEntityCollection<T>) {
        return this.entityChangeTracker.undoAll(collection);
    }

    protected undoMany(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<T[]>
    ) {
        return this.entityChangeTracker.undoMany(
            this.extractData(action),
            collection
        );
    }

    protected undoOne(collection: NxaEntityCollection<T>, action: NxaEntityAction<T>) {
        return this.entityChangeTracker.undoOne(
            this.extractData(action),
            collection
        );
    }

    /** Dangerous: Completely replace the collection's NxaChangeState. Use rarely and wisely. */
    protected setNxaChangeState(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaChangeStateMap<T>>
    ) {
        const changeState = this.extractData(action);
        return collection.changeState === changeState
            ? collection
            : { ...collection, changeState };
    }

    /**
     * Dangerous: Completely replace the collection.
     * Primarily for testing and rehydration from local storage.
     * Use rarely and wisely.
     */
    protected setCollection(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<NxaEntityCollection<T>>
    ) {
        const newCollection = this.extractData(action);
        return collection === newCollection ? collection : newCollection;
    }

    protected setFilter(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<any>
    ): NxaEntityCollection<T> {
        const filter = this.extractData(action);
        return collection.filter === filter
            ? collection
            : { ...collection, filter };
    }

    protected setLoaded(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<boolean>
    ): NxaEntityCollection<T> {
        const loaded = this.extractData(action) === true || false;
        return collection.loaded === loaded
            ? collection
            : { ...collection, loaded };
    }

    protected setLoading(
        collection: NxaEntityCollection<T>,
        action: NxaEntityAction<boolean>
    ): NxaEntityCollection<T> {
        return this.setLoadingFlag(collection, this.extractData(action));
    }

    protected setLoadingFalse(
        collection: NxaEntityCollection<T>
    ): NxaEntityCollection<T> {
        return this.setLoadingFlag(collection, false);
    }

    protected setLoadingTrue(
        collection: NxaEntityCollection<T>
    ): NxaEntityCollection<T> {
        return this.setLoadingFlag(collection, true);
    }

    /** Set the collection's loading flag */
    protected setLoadingFlag(collection: NxaEntityCollection<T>, loading: boolean) {
        loading = loading === true ? true : false;
        return collection.loading === loading
            ? collection
            : { ...collection, loading };
    }
    // #endregion Cache-only operations

    // #region helpers
    /** Safely extract data from the NxaEntityAction payload */
    protected extractData<D = any>(action: NxaEntityAction<D>): D {
        return (action.payload && action.payload.data) as D;
    }

    /** Safely extract NxaMergeStrategy from NxaEntityAction. Set to IgnoreChanges if collection itself is not tracked. */
    protected extractNxaMergeStrategy(action: NxaEntityAction) {
        // If not tracking this collection, always ignore changes
        return this.isChangeTracking
            ? action.payload && action.payload.mergeStrategy
            : NxaMergeStrategy.IgnoreChanges;
    }

    protected isOptimistic(action: NxaEntityAction) {
        return action.payload && action.payload.isOptimistic === true;
    }

    // #endregion helpers
}

/**
 * Creates {NxaEntityCollectionReducerMethods} for a given entity type.
 */
@Injectable()
export class NxaEntityCollectionReducerMethodsFactory {
    constructor(private entityDefinitionService: NxaEntityDefinitionService) { }

    /** Create the  {NxaEntityCollectionReducerMethods} for the named entity type */
    create<T>(entityName: string): NxaEntityCollectionReducerMethodMap<T> {
        const definition = this.entityDefinitionService.getDefinition<T>(
            entityName
        );
        const methodsClass = new NxaEntityCollectionReducerMethods(
            entityName,
            definition
        );

        return methodsClass.methods;
    }
}