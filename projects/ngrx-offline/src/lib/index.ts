// actions
export { NxaEntityActionFactory } from './actions/entity-action-factory';
export { NxaEntityActionGuard } from './actions/entity-action-guard';
export { ofNxaEntityOp, ofNxaEntityType } from './actions/entity-action-operators';
export {
    NxaEntityAction,
    NxaEntityActionOptions,
    NxaEntityActionPayload,
} from './actions/entity-action';
export {
    NxaEntityCacheAction,
    NxaEntityCacheQuerySet,
    NxaClearCollections,
    NxaLoadCollections,
    NxaMergeQuerySet,
    NxaSetEntityCache,
    NxaSaveEntities,
    NxaSaveEntitiesCancel,
    NxaSaveEntitiesCanceled,
    NxaSaveEntitiesError,
    NxaSaveEntitiesSuccess,
} from './actions/entity-cache-action';
export {
    NxaChangeSetOperation,
    NxaChangeSetAdd,
    NxaChangeSetDelete,
    NxaChangeSetUpdate,
    NxaChangeSetUpsert,
    NxaChangeSetItem,
    NxaChangeSet,
    NxaChangeSetItemFactory,
    nxaChangeSetItemFactory,
    excludeEmptyNxaChangeSetItems,
} from './actions/entity-cache-change-set';

export {
    NxaEntityOp,
    OP_NXA_SUCCESS,
    OP_NXA_ERROR,
    makeNxaErrorOp,
    makeNxaSuccessOp,
    makeNxaOfflineErrorOp,
    makeNxaOfflineSuccessOp
} from './actions/entity-op';
export { NxaMergeStrategy } from './actions/merge-strategy';
export { NxaUpdateResponseData } from './actions/update-response-data';

// // offline-services
export { NxaOfflineServiceError } from './offline-services/offline-service-error';
export {
    NxaEntityActionOfflineServiceError,
} from './offline-services/offline-service-error';
export {
    NxaDefaultOfflineServiceConfig,
} from './offline-services/default-offline-service-config';
export { NxaDefaultOfflineService } from './offline-services/default-offline.service';
export { NxaDefaultOfflineServiceFactory } from './offline-services/default-offline.service';
export { NxaEntityOfflineService } from './offline-services/entity-offline.service';
export {
    NxaOfflinePersistenceResultHandler,
    DefaultNxaOfflinePersistenceResultHandler,
} from './offline-services/offline-persistence-result-handler.service';

// // dataservices
export { NxaDataServiceError } from './dataservices/data-service-error';
export {
    NxaEntityActionDataServiceError,
} from './dataservices/data-service-error';
export {
    NxaDefaultDataServiceConfig,
} from './dataservices/default-data-service-config';
export { NxaDefaultDataService } from './dataservices/default-data.service';
export { NxaDefaultDataServiceFactory } from './dataservices/default-data.service';
export {
    NxaEntityCacheDataService,
} from './dataservices/entity-cache-data.service';
export { NxaEntityDataService } from './dataservices/entity-data.service';
export { NxaEntityHttpResourceUrls } from './dataservices/http-url-generator';
export { NxaHttpResourceUrls } from './dataservices/http-url-generator';
export { NxaHttpUrlGenerator } from './dataservices/http-url-generator';
export { NxaDefaultHttpUrlGenerator } from './dataservices/http-url-generator';
export { NxaNormalizeRoot } from './dataservices/http-url-generator';
export {
    NxaEntityCollectionDataService,
    NxaHttpMethods,
    NxaRequestData,
    NxaQueryParams,
} from './dataservices/interfaces';
export {
    NxaPersistenceResultHandler,
    DefaultNxaPersistenceResultHandler,
} from './dataservices/persistence-result-handler.service';


// // dispatchers
export { NxaEntityCacheDispatcher } from './dispatchers/entity-cache-dispatcher';
export {
    NxaEntityServerCommands,
    NxaEntityCacheCommands,
    NxaEntityCommands,
} from './dispatchers/entity-commands';
export { NxaEntityDispatcherBase } from './dispatchers/entity-dispatcher-base';
export {
    NxaEntityDispatcherDefaultOptions,
} from './dispatchers/entity-dispatcher-default-options';
export {
    NxaEntityDispatcherFactory,
} from './dispatchers/entity-dispatcher-factory';
export {
    NxaEntityDispatcher,
    NxaPersistanceCanceled,
} from './dispatchers/entity-dispatcher';

// // effects
export { NxaEntityCacheEffects } from './effects/entity-cache-effects';
export { persistNxaOps, NxaEntityEffects } from './effects/entity-effects';

// // entity-metadata
export {
    NxaEntityDefinitions,
    NxaEntityDefinitionService,
} from './entity-metadata/entity-definition.service';
export {
    NxaEntityDefinition,
    createNxaEntityDefinition,
} from './entity-metadata/entity-definition';
export {
    NxaEntityFilterFn,
    NxaPropsFilterFnFactory,
} from './entity-metadata/entity-filters';
export {
    NXA_ENTITY_METADATA_TOKEN,
    NxaEntityMetadata,
    NxaEntityMetadataMap,
} from './entity-metadata/entity-metadata';

// // entity-services
export {
    NxaEntityCollectionServiceBase,
} from './entity-services/entity-collection-service-base';
export {
    NxaEntityCollectionServiceElements,
    NxaEntityCollectionServiceElementsFactory,
} from './entity-services/entity-collection-service-elements-factory';
export {
    NxaEntityCollectionServiceFactory,
} from './entity-services/entity-collection-service-factory';
export {
    NxaEntityCollectionService,
} from './entity-services/entity-collection-service';
export { NxaEntityServicesBase } from './entity-services/entity-services-base';
export {
    NxaEntityServicesElements,
} from './entity-services/entity-services-elements';
export {
    NxaEntityServices,
    NxaEntityCollectionServiceMap,
} from './entity-services/entity-services';

// // reducers
export {
    NXA_ENTITY_CACHE_NAME,
    NXA_ENTITY_CACHE_NAME_TOKEN,
    NXA_ENTITY_CACHE_META_REDUCERS,
    NXA_ENTITY_COLLECTION_META_REDUCERS,
    INITIAL_NXA_ENTITY_CACHE_STATE,
} from './reducers/constants';
export { NxaEntityCacheReducerFactory } from './reducers/entity-cache-reducer';
export { NxaEntityCache } from './reducers/entity-cache';
export { NxaEntityChangeTrackerBase } from './reducers/entity-change-tracker-base';
export { NxaEntityChangeTracker } from './reducers/entity-change-tracker';
export {
    NxaEntityCollectionCreator,
    createEmptyNxaEntityCollection,
} from './reducers/entity-collection-creator';
export {
    NxaEntityCollectionReducerMethodMap,
    NxaEntityCollectionReducerMethods,
    NxaEntityCollectionReducerMethodsFactory,
} from './reducers/entity-collection-reducer-methods';
export {
    NxaEntityCollectionReducers,
    NxaEntityCollectionReducerRegistry,
} from './reducers/entity-collection-reducer-registry';
export {
    NxaEntityCollectionReducer,
    NxaEntityCollectionReducerFactory,
} from './reducers/entity-collection-reducer';
export {
    NxaChangeType,
    NxaChangeState,
    NxaChangeStateMap,
    NxaEntityCollection,
} from './reducers/entity-collection';

// // selectors
export {
    NXA_ENTITY_CACHE_SELECTOR_TOKEN,
    nxaEntityCacheSelectorProvider,
    NxaEntityCacheSelector,
    createNxaEntityCacheSelector,
} from './selectors/entity-cache-selector';
export {
    NxaCollectionSelectors,
    NxaEntitySelectors,
    NxaEntitySelectorsFactory,
} from './selectors/entity-selectors';
export {
    NxaEntitySelectors$,
    NxaEntitySelectors$Factory,
} from './selectors/entity-selectors$';

// // Utils
export { CorrelationIdGenerator } from './utils/correlation-id-generator';
export { DefaultLogger } from './utils/default-logger';
export { DefaultPluralizer } from './utils/default-pluralizer';
export { getUuid, getGuid, getGuidComb, guidComparer } from './utils/guid-fns';
export {
    Logger,
    EntityPluralNames,
    PLURAL_NAMES_TOKEN,
    Pluralizer,
} from './utils/interfaces';
export {
    defaultSelectId,
    flattenArgs,
    toUpdateFactory,
} from './utils/utilities';

// // EntityDataModule
export {
    NxaEntityDataModuleConfig,
    NxaEntityDataModuleWithoutEffects,
} from './entity-data-without-effects.module';
export { NxaEntityDataModule } from './entity-data.module';