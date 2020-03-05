/*
 * Public API Surface of ngrx-offline
 */

// actions
export { NxaEntityActionFactory } from './lib';
export { NxaEntityActionGuard } from './lib';
export { ofNxaEntityOp, ofNxaEntityType } from './lib';
export {
    NxaEntityAction,
    NxaEntityActionOptions,
    NxaEntityActionPayload,
} from './lib';
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
} from './lib';
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
} from './lib';

export {
    NxaEntityOp,
    OP_NXA_SUCCESS,
    OP_NXA_ERROR,
    makeNxaErrorOp,
    makeNxaSuccessOp,
} from './lib';
export { NxaMergeStrategy } from './lib';
export { NxaUpdateResponseData } from './lib';

// // dataservices
export { NxaDataServiceError } from './lib';
export {
    NxaEntityActionDataServiceError,
} from './lib';
export {
    NxaDefaultDataServiceConfig,
} from './lib';
export { NxaDefaultDataService } from './lib';
export { NxaDefaultDataServiceFactory } from './lib';
export {
    NxaEntityCacheDataService,
} from './lib';
export { NxaEntityDataService } from './lib';
export { NxaEntityHttpResourceUrls } from './lib';
export { NxaHttpResourceUrls } from './lib';
export { NxaHttpUrlGenerator } from './lib';
export { NxaDefaultHttpUrlGenerator } from './lib';
export { NxaNormalizeRoot } from './lib';
export {
    NxaEntityCollectionDataService,
    NxaHttpMethods,
    NxaRequestData,
    NxaQueryParams,
} from './lib';
export {
    NxaPersistenceResultHandler,
    DefaultNxaPersistenceResultHandler,
} from './lib';

// // offline-services
export { NxaOfflineServiceError } from './lib';
export {
    NxaEntityActionOfflineServiceError,
} from './lib';
export {
    NxaDefaultOfflineServiceConfig,
} from './lib';
export { NxaDefaultOfflineService } from './lib';
export { NxaDefaultOfflineServiceFactory } from './lib';
export { NxaEntityOfflineService } from './lib';
export {
    NxaOfflinePersistenceResultHandler,
    DefaultNxaOfflinePersistenceResultHandler,
} from './lib';


// // dispatchers
export { NxaEntityCacheDispatcher } from './lib';
export {
    NxaEntityServerCommands,
    NxaEntityCacheCommands,
    NxaEntityCommands,
} from './lib';
export { NxaEntityDispatcherBase } from './lib';
export {
    NxaEntityDispatcherDefaultOptions,
} from './lib';
export {
    NxaEntityDispatcherFactory,
} from './lib';
export {
    NxaEntityDispatcher,
    NxaPersistanceCanceled,
} from './lib';

// // effects
export { NxaEntityCacheEffects } from './lib';
export { persistNxaOps, NxaEntityEffects } from './lib';

// // entity-metadata
export {
    NxaEntityDefinitions,
    NxaEntityDefinitionService,
} from './lib';
export {
    NxaEntityDefinition,
    createNxaEntityDefinition,
} from './lib';
export {
    NxaEntityFilterFn,
    NxaPropsFilterFnFactory,
} from './lib';
export {
    NXA_ENTITY_METADATA_TOKEN,
    NxaEntityMetadata,
    NxaEntityMetadataMap,
} from './lib';

// // entity-services
export {
    NxaEntityCollectionServiceBase,
} from './lib';
export {
    NxaEntityCollectionServiceElements,
    NxaEntityCollectionServiceElementsFactory,
} from './lib';
export {
    NxaEntityCollectionServiceFactory,
} from './lib';
export {
    NxaEntityCollectionService,
} from './lib';
export { NxaEntityServicesBase } from './lib';
export {
    NxaEntityServicesElements,
} from './lib';
export {
    NxaEntityServices,
    NxaEntityCollectionServiceMap,
} from './lib';

// // reducers
export {
    NXA_ENTITY_CACHE_NAME,
    NXA_ENTITY_CACHE_NAME_TOKEN,
    NXA_ENTITY_CACHE_META_REDUCERS,
    NXA_ENTITY_COLLECTION_META_REDUCERS,
    INITIAL_NXA_ENTITY_CACHE_STATE,
} from './lib';
export { NxaEntityCacheReducerFactory } from './lib';
export { NxaEntityCache } from './lib';
export { NxaEntityChangeTrackerBase } from './lib';
export { NxaEntityChangeTracker } from './lib';
export {
    NxaEntityCollectionCreator,
    createEmptyNxaEntityCollection,
} from './lib';
export {
    NxaEntityCollectionReducerMethodMap,
    NxaEntityCollectionReducerMethods,
    NxaEntityCollectionReducerMethodsFactory,
} from './lib';
export {
    NxaEntityCollectionReducers,
    NxaEntityCollectionReducerRegistry,
} from './lib';
export {
    NxaEntityCollectionReducer,
    NxaEntityCollectionReducerFactory,
} from './lib';
export {
    NxaChangeType,
    NxaChangeState,
    NxaChangeStateMap,
    NxaEntityCollection,
} from './lib';

// // selectors
export {
    NXA_ENTITY_CACHE_SELECTOR_TOKEN,
    nxaEntityCacheSelectorProvider,
    NxaEntityCacheSelector,
    createNxaEntityCacheSelector,
} from './lib';
export {
    NxaCollectionSelectors,
    NxaEntitySelectors,
    NxaEntitySelectorsFactory,
} from './lib';
export {
    NxaEntitySelectors$,
    NxaEntitySelectors$Factory,
} from './lib';

// // Utils
export { CorrelationIdGenerator } from './lib';
export { DefaultLogger } from './lib';
export { DefaultPluralizer } from './lib';
export { getUuid, getGuid, getGuidComb, guidComparer } from './lib';
export {
    Logger,
    EntityPluralNames,
    PLURAL_NAMES_TOKEN,
    Pluralizer,
} from './lib';
export {
    defaultSelectId,
    flattenArgs,
    toUpdateFactory,
} from './lib';

// // EntityDataModule
export {
    NxaEntityDataModuleConfig,
    NxaEntityDataModuleWithoutEffects,
} from './lib';
export { NxaEntityDataModule } from './lib';