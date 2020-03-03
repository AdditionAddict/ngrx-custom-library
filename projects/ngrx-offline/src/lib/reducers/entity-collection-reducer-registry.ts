import { Inject, Injectable, Optional } from '@angular/core';
import { compose, MetaReducer } from '@ngrx/store';

import { NxaEntityAction } from '../actions/entity-action';
import { NxaEntityCollection } from './entity-collection';
import { NXA_ENTITY_COLLECTION_META_REDUCERS } from './constants';
import {
    NxaEntityCollectionReducer,
    NxaEntityCollectionReducerFactory,
} from './entity-collection-reducer';

/** A hash of NxaEntityCollectionReducers */
export interface NxaEntityCollectionReducers {
    [entity: string]: NxaEntityCollectionReducer<any>;
}

/**
 * Registry of entity types and their previously-constructed reducers.
 * Can create a new CollectionReducer, which it registers for subsequent use.
 */
@Injectable()
export class NxaEntityCollectionReducerRegistry {
    protected entityCollectionReducers: NxaEntityCollectionReducers = {};
    private entityCollectionMetaReducer: MetaReducer<
        NxaEntityCollection,
        NxaEntityAction
    >;

    constructor(
        private entityCollectionReducerFactory: NxaEntityCollectionReducerFactory,
        @Optional()
        @Inject(NXA_ENTITY_COLLECTION_META_REDUCERS)
        entityCollectionMetaReducers?: MetaReducer<NxaEntityCollection, NxaEntityAction>[]
    ) {
        this.entityCollectionMetaReducer = compose.apply(
            null,
            entityCollectionMetaReducers || []
        ) as any;
    }

    /**
     * Get the registered EntityCollectionReducer<T> for this entity type or create one and register it.
     * @param entityName Name of the entity type for this reducer
     */
    getOrCreateReducer<T>(entityName: string): NxaEntityCollectionReducer<T> {
        let reducer: NxaEntityCollectionReducer<T> = this.entityCollectionReducers[
            entityName
        ];

        if (!reducer) {
            reducer = this.entityCollectionReducerFactory.create<T>(entityName);
            reducer = this.registerReducer<T>(entityName, reducer);
            this.entityCollectionReducers[entityName] = reducer;
        }
        return reducer;
    }

    /**
     * Register an EntityCollectionReducer for an entity type
     * @param entityName - the name of the entity type
     * @param reducer - reducer for that entity type
     *
     * Examples:
     *   registerReducer('Hero', myHeroReducer);
     *   registerReducer('Villain', myVillainReducer);
     */
    registerReducer<T>(
        entityName: string,
        reducer: NxaEntityCollectionReducer<T>
    ): NxaEntityCollectionReducer<T> {
        reducer = this.entityCollectionMetaReducer(reducer as any);
        return (this.entityCollectionReducers[entityName.trim()] = reducer);
    }

    /**
     * Register a batch of NxaEntityCollectionReducers.
     * @param reducers - reducers to merge into existing reducers
     *
     * Examples:
     *   registerReducers({
     *     Hero: myHeroReducer,
     *     Villain: myVillainReducer
     *   });
     */
    registerReducers(reducers: NxaEntityCollectionReducers) {
        const keys = reducers ? Object.keys(reducers) : [];
        keys.forEach(key => this.registerReducer(key, reducers[key]));
    }
}