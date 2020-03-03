import { Inject, Injectable, Optional } from '@angular/core';

// Prod build requires `MemoizedSelector even though not used.
import { MemoizedSelector } from '@ngrx/store';
import { createSelector, Selector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';

import { NxaEntityCache } from '../reducers/entity-cache';
import {
    NXA_ENTITY_CACHE_SELECTOR_TOKEN,
    NxaEntityCacheSelector,
    createNxaEntityCacheSelector,
} from './entity-cache-selector';
import { NXA_ENTITY_CACHE_NAME } from '../reducers/constants';
import {
    NxaEntityCollection,
    NxaChangeStateMap,
} from '../reducers/entity-collection';
import { NxaEntityCollectionCreator } from '../reducers/entity-collection-creator';
import { NxaEntityMetadata } from '../entity-metadata/entity-metadata';

/**
 * The selector functions for entity collection members,
 * Selects from the entity collection to the collection member
 * Contrast with {NxaEntitySelectors}.
 */
export interface NxaCollectionSelectors<T> {
    readonly [selector: string]: any;

    /** Count of entities in the cached collection. */
    readonly selectCount: Selector<NxaEntityCollection<T>, number>;

    /** All entities in the cached collection. */
    readonly selectEntities: Selector<NxaEntityCollection<T>, T[]>;

    /** Map of entity keys to entities */
    readonly selectEntityMap: Selector<NxaEntityCollection<T>, Dictionary<T>>;

    /** Filter pattern applied by the entity collection's filter function */
    readonly selectFilter: Selector<NxaEntityCollection<T>, string>;

    /** Entities in the cached collection that pass the filter function */
    readonly selectFilteredEntities: Selector<NxaEntityCollection<T>, T[]>;

    /** Keys of the cached collection, in the collection's native sort order */
    readonly selectKeys: Selector<NxaEntityCollection<T>, string[] | number[]>;

    /** True when the collection has been fully loaded. */
    readonly selectLoaded: Selector<NxaEntityCollection<T>, boolean>;

    /** True when a multi-entity query command is in progress. */
    readonly selectLoading: Selector<NxaEntityCollection<T>, boolean>;

    /** NxaChangeState (including original values) of entities with unsaved changes */
    readonly selectNxaChangeState: Selector<NxaEntityCollection<T>, NxaChangeStateMap<T>>;
}

/**
 * The selector functions for entity collection members,
 * Selects from store root, through NxaEntityCache, to the entity collection member
 * Contrast with {NxaCollectionSelectors}.
 */
export interface NxaEntitySelectors<T> {
    /** Name of the entity collection for these selectors */
    readonly entityName: string;

    readonly [name: string]: MemoizedSelector<NxaEntityCollection<T>, any> | string;

    /** The cached EntityCollection itself */
    readonly selectCollection: MemoizedSelector<Object, NxaEntityCollection<T>>;

    /** Count of entities in the cached collection. */
    readonly selectCount: MemoizedSelector<Object, number>;

    /** All entities in the cached collection. */
    readonly selectEntities: MemoizedSelector<Object, T[]>;

    /** The NxaEntityCache */
    readonly selectNxaEntityCache: MemoizedSelector<Object, NxaEntityCache>;

    /** Map of entity keys to entities */
    readonly selectEntityMap: MemoizedSelector<Object, Dictionary<T>>;

    /** Filter pattern applied by the entity collection's filter function */
    readonly selectFilter: MemoizedSelector<Object, string>;

    /** Entities in the cached collection that pass the filter function */
    readonly selectFilteredEntities: MemoizedSelector<Object, T[]>;

    /** Keys of the cached collection, in the collection's native sort order */
    readonly selectKeys: MemoizedSelector<Object, string[] | number[]>;

    /** True when the collection has been fully loaded. */
    readonly selectLoaded: MemoizedSelector<Object, boolean>;

    /** True when a multi-entity query command is in progress. */
    readonly selectLoading: MemoizedSelector<Object, boolean>;

    /** NxaChangeState (including original values) of entities with unsaved changes */
    readonly selectNxaChangeState: MemoizedSelector<Object, NxaChangeStateMap<T>>;
}

/** Creates EntitySelector functions for entity collections. */
@Injectable()
export class NxaEntitySelectorsFactory {
    private entityCollectionCreator: NxaEntityCollectionCreator;
    private selectNxaEntityCache: NxaEntityCacheSelector;

    constructor(
        @Optional() entityCollectionCreator?: NxaEntityCollectionCreator,
        @Optional()
        @Inject(NXA_ENTITY_CACHE_SELECTOR_TOKEN)
        selectNxaEntityCache?: NxaEntityCacheSelector
    ) {
        this.entityCollectionCreator =
            entityCollectionCreator || new NxaEntityCollectionCreator();
        this.selectNxaEntityCache =
            selectNxaEntityCache || createNxaEntityCacheSelector(NXA_ENTITY_CACHE_NAME);
    }

    /**
     * Create the NgRx selector from the store root to the named collection,
     * e.g. from Object to Heroes.
     * @param entityName the name of the collection
     */
    createCollectionSelector<
        T = any,
        C extends NxaEntityCollection<T> = NxaEntityCollection<T>
    >(entityName: string) {
        const getCollection = (cache: NxaEntityCache = {}) =>
            <C>(
                (cache[entityName] ||
                    this.entityCollectionCreator.create<T>(entityName))
            );
        return createSelector(this.selectNxaEntityCache, getCollection);
    }

    /////// createNxaCollectionSelectors //////////

    // Based on @ngrx/entity/state_selectors.ts

    // tslint:disable:unified-signatures
    // createNxaCollectionSelectors(metadata) overload
    /**
     * Creates entity collection selectors from metadata.
     * @param metadata - NxaEntityMetadata for the collection.
     * May be partial but much have `entityName`.
     */
    createNxaCollectionSelectors<
        T,
        S extends NxaCollectionSelectors<T> = NxaCollectionSelectors<T>
    >(metadata: NxaEntityMetadata<T>): S;

    // tslint:disable:unified-signatures
    // createNxaCollectionSelectors(entityName) overload
    /**
     * Creates default entity collection selectors for an entity type.
     * Use the metadata overload for additional collection selectors.
     * @param entityName - name of the entity type
     */
    createNxaCollectionSelectors<
        T,
        S extends NxaCollectionSelectors<T> = NxaCollectionSelectors<T>
    >(entityName: string): S;

    // createNxaCollectionSelectors implementation
    createNxaCollectionSelectors<
        T,
        S extends NxaCollectionSelectors<T> = NxaCollectionSelectors<T>
    >(metadataOrName: NxaEntityMetadata<T> | string): S {
        const metadata =
            typeof metadataOrName === 'string'
                ? { entityName: metadataOrName }
                : metadataOrName;
        const selectKeys = (c: NxaEntityCollection<T>) => c.ids;
        const selectEntityMap = (c: NxaEntityCollection<T>) => c.entities;

        const selectEntities: Selector<NxaEntityCollection<T>, T[]> = createSelector(
            selectKeys,
            selectEntityMap,
            (keys: (number | string)[], entities: Dictionary<T>): T[] =>
                keys.map(key => entities[key] as T)
        );

        const selectCount: Selector<NxaEntityCollection<T>, number> = createSelector(
            selectKeys,
            keys => keys.length
        );

        // EntityCollection selectors that go beyond the ngrx/entity/EntityState selectors
        const selectFilter = (c: NxaEntityCollection<T>) => c.filter;

        const filterFn = metadata.filterFn;
        const selectFilteredEntities: Selector<NxaEntityCollection<T>, T[]> = filterFn
            ? createSelector(
                selectEntities,
                selectFilter,
                (entities: T[], pattern: any): T[] => filterFn(entities, pattern)
            )
            : selectEntities;

        const selectLoaded = (c: NxaEntityCollection<T>) => c.loaded;
        const selectLoading = (c: NxaEntityCollection<T>) => c.loading;
        const selectNxaChangeState = (c: NxaEntityCollection<T>) => c.changeState;

        // Create collection selectors for each `additionalCollectionState` property.
        // These all extend from `selectCollection`
        const extra = metadata.additionalCollectionState || {};
        const extraSelectors: {
            [name: string]: Selector<NxaEntityCollection<T>, any>;
        } = {};
        Object.keys(extra).forEach(k => {
            extraSelectors['select' + k[0].toUpperCase() + k.slice(1)] = (
                c: NxaEntityCollection<T>
            ) => (<any>c)[k];
        });

        return {
            selectCount,
            selectEntities,
            selectEntityMap,
            selectFilter,
            selectFilteredEntities,
            selectKeys,
            selectLoaded,
            selectLoading,
            selectNxaChangeState,
            ...extraSelectors,
        } as S;
    }

    /////// create //////////

    // create(metadata) overload
    /**
     * Creates the store-rooted selectors for an entity collection.
     * {NxaEntitySelectors$Factory} turns them into selectors$.
     *
     * @param metadata - NxaEntityMetadata for the collection.
     * May be partial but much have `entityName`.
     *
     * Based on ngrx/entity/state_selectors.ts
     * Differs in that these selectors select from the NgRx store root,
     * through the collection, to the collection members.
     */
    create<T, S extends NxaEntitySelectors<T> = NxaEntitySelectors<T>>(
        metadata: NxaEntityMetadata<T>
    ): S;

    // create(entityName) overload
    /**
     * Creates the default store-rooted selectors for an entity collection.
     * {NxaEntitySelectors$Factory} turns them into selectors$.
     * Use the metadata overload for additional collection selectors.
     *
     * @param entityName - name of the entity type.
     *
     * Based on ngrx/entity/state_selectors.ts
     * Differs in that these selectors select from the NgRx store root,
     * through the collection, to the collection members.
     */
    create<T, S extends NxaEntitySelectors<T> = NxaEntitySelectors<T>>(
        // tslint:disable-next-line:unified-signatures
        entityName: string
    ): S;

    // createNxaCollectionSelectors implementation
    create<T, S extends NxaEntitySelectors<T> = NxaEntitySelectors<T>>(
        metadataOrName: NxaEntityMetadata<T> | string
    ): S {
        const metadata =
            typeof metadataOrName === 'string'
                ? { entityName: metadataOrName }
                : metadataOrName;
        const entityName = metadata.entityName;
        const selectCollection: Selector<
            Object,
            NxaEntityCollection<T>
        > = this.createCollectionSelector<T>(entityName);
        const collectionSelectors = this.createNxaCollectionSelectors<T>(metadata);

        const entitySelectors: {
            [name: string]: Selector<NxaEntityCollection<T>, any>;
        } = {};
        Object.keys(collectionSelectors).forEach(k => {
            entitySelectors[k] = createSelector(
                selectCollection,
                collectionSelectors[k]
            );
        });

        return {
            entityName,
            selectCollection,
            selectNxaEntityCache: this.selectNxaEntityCache,
            ...entitySelectors,
        } as S;
    }
}