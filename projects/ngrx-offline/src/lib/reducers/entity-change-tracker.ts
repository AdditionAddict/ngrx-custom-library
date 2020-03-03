import { Update } from '@ngrx/entity';
import { NxaEntityCollection } from './entity-collection';
import { NxaMergeStrategy } from '../actions/merge-strategy';
import { NxaUpdateResponseData } from '../actions/update-response-data';

/**
 * Methods for tracking, committing, and reverting/undoing unsaved entity changes.
 * Used by NxaEntityCollectionReducerMethods which should call tracker methods BEFORE modifying the collection.
 * See NxaEntityChangeTracker docs.
 */
export interface NxaEntityChangeTracker<T> {
    // #region commit
    /**
     * Commit all changes as when the collection has been completely reloaded from the server.
     * Harmless when there are no entity changes to commit.
     * @param collection The entity collection
     */
    commitAll(collection: NxaEntityCollection<T>): NxaEntityCollection<T>;

    /**
     * Commit changes for the given entities as when they have been refreshed from the server.
     * Harmless when there are no entity changes to commit.
     * @param entityOrIdList The entities to clear tracking or their ids.
     * @param collection The entity collection
     */
    commitMany(
        entityOrIdList: (number | string | T)[],
        collection: NxaEntityCollection<T>
    ): NxaEntityCollection<T>;

    /**
     * Commit changes for the given entity as when it have been refreshed from the server.
     * Harmless when no entity changes to commit.
     * @param entityOrId The entity to clear tracking or its id.
     * @param collection The entity collection
     */
    commitOne(
        entityOrId: number | string | T,
        collection: NxaEntityCollection<T>
    ): NxaEntityCollection<T>;
    // #endregion commit

    // #region mergeQuery
    /**
     * Merge query results into the collection, adjusting the NxaChangeState per the mergeStrategy.
     * @param entities Entities returned from querying the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a queried entity when the corresponding entity in the collection has an unsaved change.
     * If not specified, implementation supplies a default strategy.
     * @returns The merged EntityCollection.
     */
    mergeQueryResults(
        entities: T[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T>;
    // #endregion mergeQuery

    // #region mergeSave
    /**
     * Merge result of saving new entities into the collection, adjusting the NxaChangeState per the mergeStrategy.
     * The default is NxaMergeStrategy.OverwriteChanges.
     * @param entities Entities returned from saving new entities to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * If not specified, implementation supplies a default strategy.
     * @returns The merged EntityCollection.
     */
    mergeSaveAdds(
        entities: T[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T>;
    /**
     * Merge successful result of deleting entities on the server that have the given primary keys
     * Clears the entity changeState for those keys unless the NxaMergeStrategy is ignoreChanges.
     * @param entities keys primary keys of the entities to remove/delete.
     * @param collection The entity collection
     * @param [mergeStrategy] How to adjust change tracking when the corresponding entity in the collection has an unsaved change.
     * If not specified, implementation supplies a default strategy.
     * @returns The merged EntityCollection.
     */
    mergeSaveDeletes(
        keys: (number | string)[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T>;

    /**
     * Merge result of saving upserted entities into the collection, adjusting the NxaChangeState per the mergeStrategy.
     * The default is NxaMergeStrategy.OverwriteChanges.
     * @param entities Entities returned from saving upsert entities to the server.
     * @param collection The entity collection
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * If not specified, implementation supplies a default strategy.
     * @returns The merged EntityCollection.
     */
    mergeSaveUpserts(
        entities: T[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T>;

    /**
     * Merge result of saving updated entities into the collection, adjusting the NxaChangeState per the mergeStrategy.
     * The default is NxaMergeStrategy.OverwriteChanges.
     * @param updates Entity response data returned from saving updated entities to the server.
     * @param [mergeStrategy] How to merge a saved entity when the corresponding entity in the collection has an unsaved change.
     * If not specified, implementation supplies a default strategy.
     * @param [skipUnchanged] True means skip update if server didn't change it. False by default.
     * If the update was optimistic and the server didn't make more changes of its own
     * then the updates are already in the collection and shouldn't make them again.
     * @param collection The entity collection
     * @returns The merged EntityCollection.
     */
    mergeSaveUpdates(
        updates: NxaUpdateResponseData<T>[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy,
        skipUnchanged?: boolean
    ): NxaEntityCollection<T>;
    // #endregion mergeSave

    // #region track
    /**
     * Track multiple entities before adding them to the collection.
     * Does NOT add to the collection (the reducer's job).
     * @param entities The entities to add. They must all have their ids.
     * @param collection The entity collection
     * @param [mergeStrategy] Track by default. Don't track if is NxaMergeStrategy.IgnoreChanges.
     * If not specified, implementation supplies a default strategy.
     */
    trackAddMany(
        entities: T[],
        collection: NxaEntityCollection<T>,
        mergeStrategy?: NxaMergeStrategy
    ): NxaEntityCollection<T>;

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
    ): NxaEntityCollection<T>;

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
    ): NxaEntityCollection<T>;

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
    ): NxaEntityCollection<T>;

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
    ): NxaEntityCollection<T>;

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
    ): NxaEntityCollection<T>;

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
    ): NxaEntityCollection<T>;

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
    ): NxaEntityCollection<T>;
    // #endregion track

    // #region undo
    /**
     * Revert the unsaved changes for all collection.
     * Harmless when there are no entity changes to undo.
     * @param collection The entity collection
     */
    undoAll(collection: NxaEntityCollection<T>): NxaEntityCollection<T>;

    /**
     * Revert the unsaved changes for the given entities.
     * Harmless when there are no entity changes to undo.
     * @param entityOrIdList The entities to revert or their ids.
     * @param collection The entity collection
     */
    undoMany(
        entityOrIdList: (number | string | T)[],
        collection: NxaEntityCollection<T>
    ): NxaEntityCollection<T>;

    /**
     * Revert the unsaved changes for the given entity.
     * Harmless when there are no entity changes to undo.
     * @param entityOrId The entity to revert or its id.
     * @param collection The entity collection
     */
    undoOne(
        entityOrId: number | string | T,
        collection: NxaEntityCollection<T>
    ): NxaEntityCollection<T>;
    // #endregion undo
}