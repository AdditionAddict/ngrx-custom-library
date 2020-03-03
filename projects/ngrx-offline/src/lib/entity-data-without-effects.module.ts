import {
    ModuleWithProviders,
    NgModule,
    Inject,
    Injector,
    InjectionToken,
    Optional,
    OnDestroy,
} from '@angular/core';

import {
    Action,
    combineReducers,
    MetaReducer,
    ReducerManager,
    StoreModule,
} from '@ngrx/store';

import { CorrelationIdGenerator } from './utils/correlation-id-generator';
import { NxaEntityDispatcherDefaultOptions } from './dispatchers/entity-dispatcher-default-options';
import { NxaEntityAction } from './actions/entity-action';
import { NxaEntityActionFactory } from './actions/entity-action-factory';
import { NxaEntityCache } from './reducers/entity-cache';
import { NxaEntityCacheDispatcher } from './dispatchers/entity-cache-dispatcher';
import { nxaEntityCacheSelectorProvider } from './selectors/entity-cache-selector';
import { NxaEntityCollectionServiceElementsFactory } from './entity-services/entity-collection-service-elements-factory';
import { NxaEntityCollectionServiceFactory } from './entity-services/entity-collection-service-factory';
import { NxaEntityServices } from './entity-services/entity-services';
import { NxaEntityCollection } from './reducers/entity-collection';
import { NxaEntityCollectionCreator } from './reducers/entity-collection-creator';
import { NxaEntityCollectionReducerFactory } from './reducers/entity-collection-reducer';
import { NxaEntityCollectionReducerMethodsFactory } from './reducers/entity-collection-reducer-methods';
import { NxaEntityCollectionReducerRegistry } from './reducers/entity-collection-reducer-registry';
import { NxaEntityDispatcherFactory } from './dispatchers/entity-dispatcher-factory';
import { NxaEntityDefinitionService } from './entity-metadata/entity-definition.service';
import { NxaEntityMetadataMap } from './entity-metadata/entity-metadata';
import { NxaEntityCacheReducerFactory } from './reducers/entity-cache-reducer';
import {
    NXA_ENTITY_CACHE_NAME,
    NXA_ENTITY_CACHE_NAME_TOKEN,
    NXA_ENTITY_CACHE_META_REDUCERS,
    NXA_ENTITY_COLLECTION_META_REDUCERS,
    INITIAL_NXA_ENTITY_CACHE_STATE,
} from './reducers/constants';

import { DefaultLogger } from './utils/default-logger';
import { NxaEntitySelectorsFactory } from './selectors/entity-selectors';
import { NxaEntitySelectors$Factory } from './selectors/entity-selectors$';
import { NxaEntityServicesBase } from './entity-services/entity-services-base';
import { NxaEntityServicesElements } from './entity-services/entity-services-elements';
import { Logger, PLURAL_NAMES_TOKEN } from './utils/interfaces';

export interface NxaEntityDataModuleConfig {
    entityMetadata?: NxaEntityMetadataMap;
    entityCacheMetaReducers?: (
        | MetaReducer<NxaEntityCache, Action>
        | InjectionToken<MetaReducer<NxaEntityCache, Action>>)[];
    entityCollectionMetaReducers?: MetaReducer<NxaEntityCollection, NxaEntityAction>[];
    // Initial NxaEntityCache state or a function that returns that state
    initialNxaEntityCacheState?: NxaEntityCache | (() => NxaEntityCache);
    pluralNames?: { [name: string]: string };
}

/**
 * Module without effects or dataservices which means no HTTP calls
 * This module helpful for internal testing.
 * Also helpful for apps that handle server access on their own and
 * therefore opt-out of @ngrx/effects for entities
 */
@NgModule({
    imports: [
        StoreModule, // rely on Store feature providers rather than Store.forFeature()
    ],
    providers: [
        CorrelationIdGenerator,
        NxaEntityDispatcherDefaultOptions,
        NxaEntityActionFactory,
        NxaEntityCacheDispatcher,
        NxaEntityCacheReducerFactory,
        nxaEntityCacheSelectorProvider,
        NxaEntityCollectionCreator,
        NxaEntityCollectionReducerFactory,
        NxaEntityCollectionReducerMethodsFactory,
        NxaEntityCollectionReducerRegistry,
        NxaEntityCollectionServiceElementsFactory,
        NxaEntityCollectionServiceFactory,
        NxaEntityDefinitionService,
        NxaEntityDispatcherFactory,
        NxaEntitySelectorsFactory,
        NxaEntitySelectors$Factory,
        NxaEntityServicesElements,
        { provide: NXA_ENTITY_CACHE_NAME_TOKEN, useValue: NXA_ENTITY_CACHE_NAME },
        { provide: NxaEntityServices, useClass: NxaEntityServicesBase },
        { provide: Logger, useClass: DefaultLogger },
    ],
})
export class NxaEntityDataModuleWithoutEffects implements OnDestroy {
    private entityCacheFeature: any;

    static forRoot(
        config: NxaEntityDataModuleConfig
    ): ModuleWithProviders<NxaEntityDataModuleWithoutEffects> {
        return {
            ngModule: NxaEntityDataModuleWithoutEffects,
            providers: [
                {
                    provide: NXA_ENTITY_CACHE_META_REDUCERS,
                    useValue: config.entityCacheMetaReducers
                        ? config.entityCacheMetaReducers
                        : [],
                },
                {
                    provide: NXA_ENTITY_COLLECTION_META_REDUCERS,
                    useValue: config.entityCollectionMetaReducers
                        ? config.entityCollectionMetaReducers
                        : [],
                },
                {
                    provide: PLURAL_NAMES_TOKEN,
                    multi: true,
                    useValue: config.pluralNames ? config.pluralNames : {},
                },
            ],
        };
    }

    constructor(
        private reducerManager: ReducerManager,
        entityCacheReducerFactory: NxaEntityCacheReducerFactory,
        private injector: Injector,
        // optional params
        @Optional()
        @Inject(NXA_ENTITY_CACHE_NAME_TOKEN)
        private entityCacheName: string,
        @Optional()
        @Inject(INITIAL_NXA_ENTITY_CACHE_STATE)
        private initialState: any,
        @Optional()
        @Inject(NXA_ENTITY_CACHE_META_REDUCERS)
        private metaReducers: (
            | MetaReducer<NxaEntityCache, Action>
            | InjectionToken<MetaReducer<NxaEntityCache, Action>>)[]
    ) {
        // Add the @@ngrx/action feature to the Store's features
        // as Store.forFeature does for StoreFeatureModule
        const key = entityCacheName || NXA_ENTITY_CACHE_NAME;

        initialState =
            typeof initialState === 'function' ? initialState() : initialState;

        const reducers: MetaReducer<NxaEntityCache, Action>[] = (
            metaReducers || []
        ).map(mr => {
            return mr instanceof InjectionToken ? injector.get(mr) : mr;
        });

        this.entityCacheFeature = {
            key,
            reducers: entityCacheReducerFactory.create(),
            reducerFactory: combineReducers,
            initialState: initialState || {},
            metaReducers: reducers,
        };
        reducerManager.addFeature(this.entityCacheFeature);
    }

    ngOnDestroy() {
        this.reducerManager.removeFeature(this.entityCacheFeature);
    }
}