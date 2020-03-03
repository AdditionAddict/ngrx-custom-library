import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { NxaEntityAction } from '../actions/entity-action';
import { NxaEntityCache } from '../reducers/entity-cache';
import { NxaEntityDispatcherFactory } from '../dispatchers/entity-dispatcher-factory';
import { NxaEntitySelectors$Factory } from '../selectors/entity-selectors$';
import { NxaEntityCollectionServiceFactory } from './entity-collection-service-factory';

/** Core ingredients of an EntityServices class */
@Injectable()
export class NxaEntityServicesElements {
    constructor(
        /**
         * Creates EntityCollectionService instances for
         * a cached collection of T entities in the ngrx store.
         */
        public readonly entityCollectionServiceFactory: NxaEntityCollectionServiceFactory,
        /** Creates NxaEntityDispatchers for entity collections */
        entityDispatcherFactory: NxaEntityDispatcherFactory,
        /** Creates observable NxaEntitySelectors$ for entity collections. */
        entitySelectors$Factory: NxaEntitySelectors$Factory,
        /** The ngrx store, scoped to the NxaEntityCache */
        public readonly store: Store<NxaEntityCache>
    ) {
        this.NxaEntityActionErrors$ = entitySelectors$Factory.NxaEntityActionErrors$;
        this.entityCache$ = entitySelectors$Factory.entityCache$;
        this.reducedActions$ = entityDispatcherFactory.reducedActions$;
    }

    /** Observable of error NxaEntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
    readonly NxaEntityActionErrors$: Observable<NxaEntityAction>;

    /** Observable of the entire entity cache */
    readonly entityCache$: Observable<NxaEntityCache> | Store<NxaEntityCache>;

    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     */
    readonly reducedActions$: Observable<Action>;
}