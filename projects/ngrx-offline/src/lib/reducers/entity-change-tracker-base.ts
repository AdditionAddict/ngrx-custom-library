import { EntityAdapter, IdSelector, Update } from '@ngrx/entity';

import { NxaChangeType, NxaEntityCollection } from './entity-collection';
import { defaultSelectId } from '../utils/utilities';
import { NxaEntityChangeTracker } from './entity-change-tracker';
import { NxaMergeStrategy } from '../actions/merge-strategy';
import { NxaUpdateResponseData } from '../actions/update-response-data';

/**
 * The default implementation of NxaEntityChangeTracker with
 * methods for tracking, committing, and reverting/undoing unsaved entity changes.
 * Used by NxaEntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
 * See NxaEntityChangeTracker docs.
 */
export class NxaEntityChangeTrackerBase<T> implements NxaEntityChangeTracker<T> {
    constructor(
        private adapter: EntityAdapter<T>,
        private selectId: IdSelector<T>
    ) {
        /** Extract the primary key (id); default to `id` */
        this.selectId = selectId || defaultSelectId;
    }

    // #region commit methods
    /**
     * Commit all changes as when the collection has been completely reloaded from the server.
     * Harmless when there are no entity changes to commit.
     * @param collection The entity collection
     */
    commitAll(collection: NxaEntityCollection<T>): NxaEntityCollection<T> {
        return Object.keys(collection.changeState).length === 0
            ? collection
            : { ...collection, changeState: {} };
    }

    /**
     * Commit changes for the given entities as when they have been refreshed from the server.
     * Harmless when there are no entity changes to commit.
     * @param entityOrIdList The entities to clear tracking or their ids.
     * @param collection The entity collection
     */
    commitMany(
        entityOrIdList: (number | string | T)[],
        collection: NxaEntityCollection<T>
    ): NxaEntityCollection<T> {
        if (entityOrIdList == null || entityOrIdList.length === 0) {
            return collection; // nothing to commit
        }
        let didMutate = false;
        const changeState = entityOrIdList.reduce((chgState, entityOrId) => {
            const id =
                typeof entityOrId === 'object'
                    ? this.selectId(entityOrId)
                    : (entityOrId as string | number);
            if (chgState[id]) {
                if (!didMutate) {
                    chgState = { ...chgState };
                    didMutate = true;
                }
                delete chgState[id];
            }
            return chgState;
        }, collection.changeState);

        return didMutate ? { ...collection, changeState } : collection;
    }

    /**
     * Commit changes for the given entity as when it have been refreshed from the server.
     * Harmless when no entity changes to commit.
     * @param entityOrId The entity to clear tracking or its id.
     * @param collection The entity collection
     */
    commitOne(
        entityOrId: number | string | T,
        collection: NxaEntityCollection<T>
    ): NxaEntityCollection<T> {
        return entityOrId == null
            ? collection
            : this.commitMany([entityOrId], collection);
    }

    // #endregion commit methods

    // #region merge query
    /**
     * Merge query results into the collection, adjusting the NxaChangeState per the mergeStrategy.
     * @param entities Entities returned from querying the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a queried entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to NxaMergeStrategy.PreserveChanges.
     * @returns The merged EntityCollection.
     */
    mergeQueryResults(
        entities: T[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T> {
        return this.mergeServerUpserts(
            entities,
            collection,
            NxaMergeStrategy.PreserveChanges,
            mergeStrategy
        );
    }
    // #endregion merge query results

    // #region merge save results
    /**
     * Merge result of saving new entities into the collection, adjusting the NxaChangeState per the mergeStrategy.
     * The default is NxaMergeStrategy.OverwriteChanges.
     * @param entities Entities returned from saving new entities to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to NxaMergeStrategy.OverwriteChanges.
     * @returns The merged EntityCollection.
     */
    mergeSaveAdds(
        entities: T[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T> {
        return this.mergeServerUpserts(
            entities,
            collection,
            NxaMergeStrategy.OverwriteChanges,
            mergeStrategy
        );
    }

    /**
     * Merge successful result of deleting entities on the server that have the given primary keys
     * Clears the entity changeState for those keys unless the NxaMergeStrategy is ignoreChanges.
     * @param entities keys primary keys of the entities to remove/delete.
     * @param collection The entity collection
     * @param [mergeStrategy] How to adjust change tracking when the corresponding entity in the collection has an unsaved change.
     * Defaults to NxaMergeStrategy.OverwriteChanges.
     * @returns The merged EntityCollection.
     */
    mergeSaveDeletes(
        keys: (number | string)[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T> {
        mergeStrategy =
            mergeStrategy == null ? NxaMergeStrategy.OverwriteChanges : mergeStrategy;
        // same logic for all non-ignore merge strategies: always clear (commit) the changes
        const deleteIds = keys as string[]; // make TypeScript happy
        collection =
            mergeStrategy === NxaMergeStrategy.IgnoreChanges
                ? collection
                : this.commitMany(deleteIds, collection);
        return this.adapter.removeMany(deleteIds, collection);
    }

    /**
     * Merge result of saving updated entities into the collection, adjusting the NxaChangeState per the mergeStrategy.
     * The default is NxaMergeStrategy.OverwriteChanges.
     * @param updateResponseData Entity response data returned from saving updated entities to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to NxaMergeStrategy.OverwriteChanges.
     * @param [skipUnchanged] True means skip update if server didn't change it. False by default.
     * If the update was optimistic and the server didn't make more changes of its own
     * then the updates are already in the collection and shouldn't make them again.
     * @returns The merged EntityCollection.
     */
    mergeSaveUpdates(
        updateResponseData: NxaUpdateResponseData<T>[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy,
        skipUnchanged = false
    ): NxaEntityCollection<T> {
        if (updateResponseData == null || updateResponseData.length === 0) {
            return collection; // nothing to merge.
        }

        let didMutate = false;
        let changeState = collection.changeState;
        mergeStrategy =
            mergeStrategy == null ? NxaMergeStrategy.OverwriteChanges : mergeStrategy;
        let updates: Update<T>[];

        switch (mergeStrategy) {
            case NxaMergeStrategy.IgnoreChanges:
                updates = filterChanged(updateResponseData);
                return this.adapter.updateMany(updates, collection);

            case NxaMergeStrategy.OverwriteChanges:
                changeState = updateResponseData.reduce((chgState, update) => {
                    const oldId = update.id;
                    const change = chgState[oldId];
                    if (change) {
                        if (!didMutate) {
                            chgState = { ...chgState };
                            didMutate = true;
                        }
                        delete chgState[oldId];
                    }
                    return chgState;
                }, collection.changeState);

                collection = didMutate ? { ...collection, changeState } : collection;

                updates = filterChanged(updateResponseData);
                return this.adapter.updateMany(updates, collection);

            case NxaMergeStrategy.PreserveChanges: {
                const updateableEntities = [] as NxaUpdateResponseData<T>[];
                changeState = updateResponseData.reduce((chgState, update) => {
                    const oldId = update.id;
                    const change = chgState[oldId];
                    if (change) {
                        // Tracking a change so update original value but not the current value
                        if (!didMutate) {
                            chgState = { ...chgState };
                            didMutate = true;
                        }
                        const newId = this.selectId(update.changes as T);
                        const oldNxaChangeState = change;
                        // If the server changed the id, register the new "originalValue" under the new id
                        // and remove the change tracked under the old id.
                        if (newId !== oldId) {
                            delete chgState[oldId];
                        }
                        const newOrigValue = {
                            ...(oldNxaChangeState!.originalValue as any),
                            ...(update.changes as any),
                        };
                        (chgState as any)[newId] = {
                            ...oldNxaChangeState,
                            originalValue: newOrigValue,
                        };
                    } else {
                        updateableEntities.push(update);
                    }
                    return chgState;
                }, collection.changeState);
                collection = didMutate ? { ...collection, changeState } : collection;

                updates = filterChanged(updateableEntities);
                return this.adapter.updateMany(updates, collection);
            }
        }

        /**
         * Conditionally keep only those updates that have additional server changes.
         * (e.g., for optimistic saves because they updates are already in the current collection)
         * Strip off the `changed` property.
         * @responseData Entity response data from server.
         * May be an NxaUpdateResponseData<T>, a subclass of Update<T> with a 'changed' flag.
         * @returns Update<T> (without the changed flag)
         */
        function filterChanged(responseData: NxaUpdateResponseData<T>[]): Update<T>[] {
            if (skipUnchanged === true) {
                // keep only those updates that the server changed (knowable if is NxaUpdateResponseData<T>)
                responseData = responseData.filter(r => r.changed === true);
            }
            // Strip unchanged property from responseData, leaving just the pure Update<T>
            // TODO: Remove? probably not necessary as the Update isn't stored and adapter will ignore `changed`.
            return responseData.map(r => ({ id: r.id as any, changes: r.changes }));
        }
    }

    /**
     * Merge result of saving upserted entities into the collection, adjusting the NxaChangeState per the mergeStrategy.
     * The default is NxaMergeStrategy.OverwriteChanges.
     * @param entities Entities returned from saving upserts to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * Defaults to NxaMergeStrategy.OverwriteChanges.
     * @returns The merged EntityCollection.
     */
    mergeSaveUpserts(
        entities: T[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T> {
        return this.mergeServerUpserts(
            entities,
            collection,
            NxaMergeStrategy.OverwriteChanges,
            mergeStrategy
        );
    }
    // #endregion merge save results

    // #region query & save helpers
    /**
     *
     * @param entities Entities to merge
     * @param collection Collection into which entities are merged
     * @param defaultNxaMergeStrategy How to merge when action's NxaMergeStrategy is unspecified
     * @param [mergeStrategy] The action's NxaMergeStrategy
     */
    private mergeServerUpserts(
        entities: T[],
        collection: NxaEntityCollection<T>,
        defaultNxaMergeStrategy: NxaMergeStrategy,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T> {
        if (entities == null || entities.length === 0) {
            return collection; // nothing to merge.
        }

        let didMutate = false;
        let changeState = collection.changeState;
        mergeStrategy =
            mergeStrategy == null ? defaultNxaMergeStrategy : mergeStrategy;

        switch (mergeStrategy) {
            case NxaMergeStrategy.IgnoreChanges:
                return this.adapter.upsertMany(entities, collection);

            case NxaMergeStrategy.OverwriteChanges:
                collection = this.adapter.upsertMany(entities, collection);

                changeState = entities.reduce((chgState, entity) => {
                    const id = this.selectId(entity);
                    const change = chgState[id];
                    if (change) {
                        if (!didMutate) {
                            chgState = { ...chgState };
                            didMutate = true;
                        }
                        delete chgState[id];
                    }
                    return chgState;
                }, collection.changeState);

                return didMutate ? { ...collection, changeState } : collection;

            case NxaMergeStrategy.PreserveChanges: {
                const upsertEntities = [] as T[];
                changeState = entities.reduce((chgState, entity) => {
                    const id = this.selectId(entity);
                    const change = chgState[id];
                    if (change) {
                        if (!didMutate) {
                            chgState = {
                                ...chgState,
                                [id]: {
                                    ...chgState[id]!,
                                    originalValue: entity,
                                },
                            };
                            didMutate = true;
                        }
                    } else {
                        upsertEntities.push(entity);
                    }
                    return chgState;
                }, collection.changeState);

                collection = this.adapter.upsertMany(upsertEntities, collection);
                return didMutate ? { ...collection, changeState } : collection;
            }
        }
    }
    // #endregion query & save helpers

    // #region track methods
    /**
     * Track multiple entities before adding them to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param entities The entities to add. They must all have their ids.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is NxaMergeStrategy.IgnoreChanges.
     */
    trackAddMany(
        entities: T[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T> {
        if (
            mergeStrategy === NxaMergeStrategy.IgnoreChanges ||
            entities == null ||
            entities.length === 0
        ) {
            return collection; // nothing to track
        }
        let didMutate = false;
        const changeState = entities.reduce((chgState, entity) => {
            const id = this.selectId(entity);
            if (id == null || id === '') {
                throw new Error(
                    `${collection.entityName} entity add requires a key to be tracked`
                );
            }
            const trackedChange = chgState[id];

            if (!trackedChange) {
                if (!didMutate) {
                    didMutate = true;
                    chgState = { ...chgState };
                }
                chgState[id] = { changeType: NxaChangeType.Added };
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
    }

    /**
     * Track an entity before adding it to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param entity The entity to add. It must have an id.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is NxaMergeStrategy.IgnoreChanges.
     * If not specified, implementation supplies a default strategy.
     */
    trackAddOne(
        entity: T,
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T> {
        return entity == null
            ? collection
            : this.trackAddMany([entity], collection, mergeStrategy);
    }

    /**
     * Track multiple entities before removing them with the intention of deleting them on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param keys The primary keys of the entities to delete.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is NxaMergeStrategy.IgnoreChanges.
     */
    trackDeleteMany(
        keys: (number | string)[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T> {
        if (
            mergeStrategy === NxaMergeStrategy.IgnoreChanges ||
            keys == null ||
            keys.length === 0
        ) {
            return collection; // nothing to track
        }
        let didMutate = false;
        const entityMap = collection.entities;
        const changeState = keys.reduce((chgState, id) => {
            const originalValue = entityMap[id];
            if (originalValue) {
                const trackedChange = chgState[id];
                if (trackedChange) {
                    if (trackedChange.changeType === NxaChangeType.Added) {
                        // Special case: stop tracking an added entity that you delete
                        // The caller must also detect this, remove it immediately from the collection
                        // and skip attempt to delete on the server.
                        cloneChgStateOnce();
                        delete chgState[id];
                    } else if (trackedChange.changeType === NxaChangeType.Updated) {
                        // Special case: switch change type from Updated to Deleted.
                        cloneChgStateOnce();
                        trackedChange.changeType = NxaChangeType.Deleted;
                    }
                } else {
                    // Start tracking this entity
                    cloneChgStateOnce();
                    chgState[id] = { changeType: NxaChangeType.Deleted, originalValue };
                }
            }
            return chgState;

            function cloneChgStateOnce() {
                if (!didMutate) {
                    didMutate = true;
                    chgState = { ...chgState };
                }
            }
        }, collection.changeState);

        return didMutate ? { ...collection, changeState } : collection;
    }

    /**
     * Track an entity before it is removed with the intention of deleting it on the server.
     * Does NOT remove from the collection (the reducer's job).
     * @param key The primary key of the entity to delete.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is NxaMergeStrategy.IgnoreChanges.
     */
    trackDeleteOne(
        key: number | string,
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T> {
        return key == null
            ? collection
            : this.trackDeleteMany([key], collection, mergeStrategy);
    }

    /**
     * Track multiple entities before updating them in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param updates The entities to update.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is NxaMergeStrategy.IgnoreChanges.
     */
    trackUpdateMany(
        updates: Update<T>[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T> {
        if (
            mergeStrategy === NxaMergeStrategy.IgnoreChanges ||
            updates == null ||
            updates.length === 0
        ) {
            return collection; // nothing to track
        }
        let didMutate = false;
        const entityMap = collection.entities;
        const changeState = updates.reduce((chgState, update) => {
            const { id, changes: entity } = update;
            if (id == null || id === '') {
                throw new Error(
                    `${collection.entityName} entity update requires a key to be tracked`
                );
            }
            const originalValue = entityMap[id];
            // Only track if it is in the collection. Silently ignore if it is not.
            // @ngrx/entity adapter would also silently ignore.
            // Todo: should missing update entity really be reported as an error?
            if (originalValue) {
                const trackedChange = chgState[id];
                if (!trackedChange) {
                    if (!didMutate) {
                        didMutate = true;
                        chgState = { ...chgState };
                    }
                    chgState[id] = { changeType: NxaChangeType.Updated, originalValue };
                }
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
    }

    /**
     * Track an entity before updating it in the collection.
     * Does NOT update the collection (the reducer's job).
     * @param update The entity to update.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is NxaMergeStrategy.IgnoreChanges.
     */
    trackUpdateOne(
        update: Update<T>,
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T> {
        return update == null
            ? collection
            : this.trackUpdateMany([update], collection, mergeStrategy);
    }

    /**
     * Track multiple entities before upserting (adding and updating) them to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param entities The entities to add or update. They must be complete entities with ids.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is NxaMergeStrategy.IgnoreChanges.
     */
    trackUpsertMany(
        entities: T[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T> {
        if (
            mergeStrategy === NxaMergeStrategy.IgnoreChanges ||
            entities == null ||
            entities.length === 0
        ) {
            return collection; // nothing to track
        }
        let didMutate = false;
        const entityMap = collection.entities;
        const changeState = entities.reduce((chgState, entity) => {
            const id = this.selectId(entity);
            if (id == null || id === '') {
                throw new Error(
                    `${collection.entityName} entity upsert requires a key to be tracked`
                );
            }
            const trackedChange = chgState[id];

            if (!trackedChange) {
                if (!didMutate) {
                    didMutate = true;
                    chgState = { ...chgState };
                }

                const originalValue = entityMap[id];
                chgState[id] =
                    originalValue == null
                        ? { changeType: NxaChangeType.Added }
                        : { changeType: NxaChangeType.Updated, originalValue };
            }
            return chgState;
        }, collection.changeState);
        return didMutate ? { ...collection, changeState } : collection;
    }

    /**
     * Track an entity before upsert (adding and updating) it to the collection.
     * Does NOT update the collection (the reducer's job).
     * @param entities The entity to add or update. It must be a complete entity with its id.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is NxaMergeStrategy.IgnoreChanges.
     */
    trackUpsertOne(
        entity: T,
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T> {
        return entity == null
            ? collection
            : this.trackUpsertMany([entity], collection, mergeStrategy);
    }
    // #endregion track methods

    // #region undo methods
    /**
     * Revert the unsaved changes for all collection.
     * Harmless when there are no entity changes to undo.
     * @param collection The entity collection
     */
    undoAll(collection: NxaEntityCollection<T>): NxaEntityCollection<T> {
        const ids = Object.keys(collection.changeState);

        const { remove, upsert } = ids.reduce(
            (acc, id) => {
                const changeState = acc.chgState[id]!;
                switch (changeState.changeType) {
                    case NxaChangeType.Added:
                        acc.remove.push(id);
                        break;
                    case NxaChangeType.Deleted:
                        const removed = changeState!.originalValue;
                        if (removed) {
                            acc.upsert.push(removed);
                        }
                        break;
                    case NxaChangeType.Updated:
                        acc.upsert.push(changeState!.originalValue!);
                        break;
                }
                return acc;
            },
            // entitiesToUndo
            {
                remove: [] as (number | string)[],
                upsert: [] as T[],
                chgState: collection.changeState,
            }
        );

        collection = this.adapter.removeMany(remove as string[], collection);
        collection = this.adapter.upsertMany(upsert, collection);

        return { ...collection, changeState: {} };
    }

    /**
     * Revert the unsaved changes for the given entities.
     * Harmless when there are no entity changes to undo.
     * @param entityOrIdList The entities to revert or their ids.
     * @param collection The entity collection
     */
    undoMany(
        entityOrIdList: (number | string | T)[],
        collection: NxaEntityCollection<T>
    ): NxaEntityCollection<T> {
        if (entityOrIdList == null || entityOrIdList.length === 0) {
            return collection; // nothing to undo
        }
        let didMutate = false;

        const { changeState, remove, upsert } = entityOrIdList.reduce(
            (acc, entityOrId) => {
                let chgState = acc.changeState;
                const id =
                    typeof entityOrId === 'object'
                        ? this.selectId(entityOrId)
                        : (entityOrId as string | number);
                const change = chgState[id]!;
                if (change) {
                    if (!didMutate) {
                        chgState = { ...chgState };
                        didMutate = true;
                    }
                    delete chgState[id]; // clear tracking of this entity
                    acc.changeState = chgState;
                    switch (change.changeType) {
                        case NxaChangeType.Added:
                            acc.remove.push(id);
                            break;
                        case NxaChangeType.Deleted:
                            const removed = change!.originalValue;
                            if (removed) {
                                acc.upsert.push(removed);
                            }
                            break;
                        case NxaChangeType.Updated:
                            acc.upsert.push(change!.originalValue!);
                            break;
                    }
                }
                return acc;
            },
            // entitiesToUndo
            {
                remove: [] as (number | string)[],
                upsert: [] as T[],
                changeState: collection.changeState,
            }
        );

        collection = this.adapter.removeMany(remove as string[], collection);
        collection = this.adapter.upsertMany(upsert, collection);
        return didMutate ? { ...collection, changeState } : collection;
    }

    /**
     * Revert the unsaved changes for the given entity.
     * Harmless when there are no entity changes to undo.
     * @param entityOrId The entity to revert or its id.
     * @param collection The entity collection
     */
    undoOne(
        entityOrId: number | string | T,
        collection: NxaEntityCollection<T>
    ): NxaEntityCollection<T> {
        return entityOrId == null
            ? collection
            : this.undoMany([entityOrId], collection);
    }
    // #endregion undo methods
}