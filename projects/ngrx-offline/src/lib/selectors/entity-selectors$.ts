import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';

import { Observable } from 'rxjs';
import { filter, shareReplay } from 'rxjs/operators';

import { NxaEntityAction } from '../actions/entity-action';
import { OP_NXA_ERROR } from '../actions/entity-op';
import { ofNxaEntityType } from '../actions/entity-action-operators';
import {
    NXA_ENTITY_CACHE_SELECTOR_TOKEN,
    NxaEntityCacheSelector,
} from './entity-cache-selector';
import { NxaEntitySelectors } from './entity-selectors';
import { NxaEntityCache } from '../reducers/entity-cache';
import {
    NxaEntityCollection,
    NxaChangeStateMap,
} from '../reducers/entity-collection';

/**
 * The selector observable functions for entity collection members.
 */
export interface NxaEntitySelectors$<T> {
    /** Name of the entity collection for these selectors$ */
    readonly entityName: string;

    /** Names from custom selectors from additionalCollectionState fits here, 'any' to avoid conflict with entityName */
    readonly [name: string]: Observable<any> | Store<any> | any;

    /** Observable of the collection as a whole */
    readonly collection$: Observable<NxaEntityCollection> | Store<NxaEntityCollection>;

    /** Observable of count of entities in the cached collection. */
    readonly count$: Observable<number> | Store<number>;

    /** Observable of all entities in the cached collection. */
    readonly entities$: Observable<T[]> | Store<T[]>;

    /** Observable of actions related to this entity type. */
    readonly NxaEntityActions$: Observable<NxaEntityAction>;

    /** Observable of the map of entity keys to entities */
    readonly entityMap$: Observable<Dictionary<T>> | Store<Dictionary<T>>;

    /** Observable of error actions related to this entity type. */
    readonly errors$: Observable<NxaEntityAction>;

    /** Observable of the filter pattern applied by the entity collection's filter function */
    readonly filter$: Observable<string> | Store<string>;

    /** Observable of entities in the cached collection that pass the filter function */
    readonly filteredEntities$: Observable<T[]> | Store<T[]>;

    /** Observable of the keys of the cached collection, in the collection's native sort order */
    readonly keys$: Observable<string[] | number[]> | Store<string[] | number[]>;

    /** Observable true when the collection has been loaded */
    readonly loaded$: Observable<boolean> | Store<boolean>;

    /** Observable true when a multi-entity query command is in progress. */
    readonly loading$: Observable<boolean> | Store<boolean>;

    /** NxaChangeState (including original values) of entities with unsaved changes */
    readonly changeState$:
    | Observable<NxaChangeStateMap<T>>
    | Store<NxaChangeStateMap<T>>;
}

/** Creates observable NxaEntitySelectors$ for entity collections. */
@Injectable()
export class NxaEntitySelectors$Factory {
    /** Observable of the NxaEntityCache */
    entityCache$: Observable<NxaEntityCache>;

    /** Observable of error NxaEntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
    NxaEntityActionErrors$: Observable<NxaEntityAction>;

    constructor(
        private store: Store<any>,
        private actions: Actions<NxaEntityAction>,
        @Inject(NXA_ENTITY_CACHE_SELECTOR_TOKEN)
        private selectNxaEntityCache: NxaEntityCacheSelector
    ) {
        // This service applies to the cache in ngrx/store named `cacheName`
        this.entityCache$ = this.store.select(this.selectNxaEntityCache);
        this.NxaEntityActionErrors$ = actions.pipe(
            filter(
                (ea: NxaEntityAction) =>
                    ea.payload &&
                    ea.payload.entityOp &&
                    ea.payload.entityOp.endsWith(OP_NXA_ERROR)
            ),
            shareReplay(1)
        );
    }

    /**
     * Creates an entity collection's selectors$ observables for this factory's store.
     * `selectors$` are observable selectors of the cached entity collection.
     * @param entityName - is also the name of the collection.
     * @param selectors - selector functions for this collection.
     **/
    create<T, S$ extends NxaEntitySelectors$<T> = NxaEntitySelectors$<T>>(
        entityName: string,
        selectors: NxaEntitySelectors<T>
    ): S$ {
        const selectors$: { [prop: string]: any } = {
            entityName,
        };

        Object.keys(selectors).forEach(name => {
            if (name.startsWith('select')) {
                // strip 'select' prefix from the selector fn name and append `$`
                // Ex: 'selectEntities' => 'entities$'
                const name$ = name[6].toLowerCase() + name.substr(7) + '$';
                selectors$[name$] = this.store.select((<any>selectors)[name]);
            }
        });
        selectors$.NxaEntityActions$ = this.actions.pipe(ofNxaEntityType(entityName));
        selectors$.errors$ = this.NxaEntityActionErrors$.pipe(
            ofNxaEntityType(entityName)
        );
        return selectors$ as S$;
    }
}