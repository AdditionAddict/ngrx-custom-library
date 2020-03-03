import { Observable } from 'rxjs';
import { NxaEntityActionOptions } from '../actions/entity-action';
import { NxaQueryParams } from '../dataservices/interfaces';

/** Commands that update the remote server. */
export interface NxaEntityServerCommands<T> {
    /**
     * Dispatch action to save a new entity to remote storage.
     * @param entity entity to add, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @returns A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    add(entity: T, options?: NxaEntityActionOptions): Observable<T>;

    /**
     * Dispatch action to cancel the persistence operation (query or save) with the given correlationId.
     * @param correlationId The correlation id for the corresponding NxaEntityAction
     * @param [reason] explains why canceled and by whom.
     * @param [options] options such as the tag
     */
    cancel(
        correlationId: any,
        reason?: string,
        options?: NxaEntityActionOptions
    ): void;

    /**
     * Dispatch action to delete entity from remote storage by key.
     * @param key The entity to delete
     * @param [options] options that influence save and merge behavior
     * @returns A terminating Observable of the deleted key
     * after server reports successful save or the save error.
     */
    delete(entity: T, options?: NxaEntityActionOptions): Observable<number | string>;

    /**
     * Dispatch action to delete entity from remote storage by key.
     * @param key The primary key of the entity to remove
     * @param [options] options that influence save and merge behavior
     * @returns Observable of the deleted key
     * after server reports successful save or the save error.
     */
    delete(
        key: number | string,
        options?: NxaEntityActionOptions
    ): Observable<number | string>;

    /**
     * Dispatch action to query remote storage for all entities and
     * merge the queried entities into the cached collection.
     * @param [options] options that influence merge behavior
     * @returns A terminating Observable of the collection
     * after server reports successful query or the query error.
     * @see load()
     */
    getAll(options?: NxaEntityActionOptions): Observable<T[]>;

    /**
     * Dispatch action to query remote storage for the entity with this primary key.
     * If the server returns an entity,
     * merge it into the cached collection.
     * @param key The primary key of the entity to get.
     * @param [options] options that influence merge behavior
     * @returns A terminating Observable of the queried entities that are in the collection
     * after server reports success or the query error.
     */
    getByKey(key: any, options?: NxaEntityActionOptions): Observable<T>;

    /**
     * Dispatch action to query remote storage for the entities that satisfy a query expressed
     * with either a query parameter map or an HTTP URL query string,
     * and merge the results into the cached collection.
     * @param queryParams the query in a form understood by the server
     * @param [options] options that influence merge behavior
     * @returns A terminating Observable of the queried entities
     * after server reports successful query or the query error.
     */
    getWithQuery(
        queryParams: NxaQueryParams | string,
        options?: NxaEntityActionOptions
    ): Observable<T[]>;

    /**
     * Dispatch action to query remote storage for all entities and
     * completely replace the cached collection with the queried entities.
     * @param [options] options that influence load behavior
     * @returns A terminating Observable of the entities in the collection
     * after server reports successful query or the query error.
     * @see getAll
     */
    load(options?: NxaEntityActionOptions): Observable<T[]>;

    /**
     * Dispatch action to save the updated entity (or partial entity) in remote storage.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param entity update entity, which might be a partial of T but must at least have its key.
     * @param [options] options that influence save and merge behavior
     * @returns A terminating Observable of the updated entity
     * after server reports successful save or the save error.
     */
    update(entity: Partial<T>, options?: NxaEntityActionOptions): Observable<T>;

    /**
     * Dispatch action to save a new or update an existing entity to remote storage.
     * Only dispatch this action if your server supports upsert.
     * @param entity entity to upsert, which may omit its key if pessimistic and the server creates the key;
     * must have a key if optimistic save.
     * @returns A terminating Observable of the entity
     * after server reports successful save or the save error.
     */
    upsert(entity: T, options?: NxaEntityActionOptions): Observable<T>;
}

/*** A collection's cache-only commands, which do not update remote storage ***/

export interface NxaEntityCacheCommands<T> {
    /**
     * Replace all entities in the cached collection.
     * Does not save to remote storage.
     * @param entities to add directly to cache.
     * @param [options] options such as mergeStrategy
     */
    addAllToCache(entities: T[], options?: NxaEntityActionOptions): void;

    /**
     * Add a new entity directly to the cache.
     * Does not save to remote storage.
     * Ignored if an entity with the same primary key is already in cache.
     * @param entity to add directly to cache.
     * @param [options] options such as mergeStrategy
     */
    addOneToCache(entity: T, options?: NxaEntityActionOptions): void;

    /**
     * Add multiple new entities directly to the cache.
     * Does not save to remote storage.
     * Entities with primary keys already in cache are ignored.
     * @param entities to add directly to cache.
     * @param [options] options such as mergeStrategy
     */
    addManyToCache(entities: T[], options?: NxaEntityActionOptions): void;

    /** Clear the cached entity collection */
    clearCache(options?: NxaEntityActionOptions): void;

    /**
     * Remove an entity directly from the cache.
     * Does not delete that entity from remote storage.
     * @param entity The entity to remove
     * @param [options] options such as mergeStrategy
     */
    removeOneFromCache(entity: T, options?: NxaEntityActionOptions): void;

    /**
     * Remove an entity directly from the cache.
     * Does not delete that entity from remote storage.
     * @param key The primary key of the entity to remove
     * @param [options] options such as mergeStrategy
     */
    removeOneFromCache(key: number | string, options?: NxaEntityActionOptions): void;

    /**
     * Remove multiple entities directly from the cache.
     * Does not delete these entities from remote storage.
     * @param entity The entities to remove
     * @param [options] options such as mergeStrategy
     */
    removeManyFromCache(entities: T[], options?: NxaEntityActionOptions): void;

    /**
     * Remove multiple entities directly from the cache.
     * Does not delete these entities from remote storage.
     * @param keys The primary keys of the entities to remove
     * @param [options] options such as mergeStrategy
     */
    removeManyFromCache(
        keys: (number | string)[],
        options?: NxaEntityActionOptions
    ): void;

    /**
     * Update a cached entity directly.
     * Does not update that entity in remote storage.
     * Ignored if an entity with matching primary key is not in cache.
     * The update entity may be partial (but must have its key)
     * in which case it patches the existing entity.
     * @param entity to update directly in cache.
     * @param [options] options such as mergeStrategy
     */
    updateOneInCache(entity: Partial<T>, options?: NxaEntityActionOptions): void;

    /**
     * Update multiple cached entities directly.
     * Does not update these entities in remote storage.
     * Entities whose primary keys are not in cache are ignored.
     * Update entities may be partial but must at least have their keys.
     * such partial entities patch their cached counterparts.
     * @param entities to update directly in cache.
     * @param [options] options such as mergeStrategy
     */
    updateManyInCache(
        entities: Partial<T>[],
        options?: NxaEntityActionOptions
    ): void;

    /**
     * Insert or update a cached entity directly.
     * Does not save to remote storage.
     * Upsert entity might be a partial of T but must at least have its key.
     * Pass the Update<T> structure as the payload.
     * @param entity to upsert directly in cache.
     * @param [options] options such as mergeStrategy
     */
    upsertOneInCache(entity: Partial<T>, options?: NxaEntityActionOptions): void;

    /**
     * Insert or update multiple cached entities directly.
     * Does not save to remote storage.
     * Upsert entities might be partial but must at least have their keys.
     * Pass an array of the Update<T> structure as the payload.
     * @param entities to upsert directly in cache.
     * @param [options] options such as mergeStrategy
     */
    upsertManyInCache(
        entities: Partial<T>[],
        options?: NxaEntityActionOptions
    ): void;

    /**
     * Set the pattern that the collection's filter applies
     * when using the `filteredEntities` selector.
     */
    setFilter(pattern: any, options?: NxaEntityActionOptions): void;

    /** Set the loaded flag */
    setLoaded(isLoaded: boolean, options?: NxaEntityActionOptions): void;

    /** Set the loading flag */
    setLoading(isLoading: boolean, options?: NxaEntityActionOptions): void;
}

/** Commands that dispatch entity actions for a collection */
export interface NxaEntityCommands<T>
    extends NxaEntityServerCommands<T>,
    NxaEntityCacheCommands<T> { }