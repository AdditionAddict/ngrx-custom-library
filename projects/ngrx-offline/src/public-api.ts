/*
 * Public API Surface of ngrx-offline
 */

// actions
export { EntityActionFactory } from './lib';
export { EntityActionGuard } from './lib';
export { ofEntityOp, ofEntityType } from './lib';
export {
    EntityAction,
    EntityActionOptions,
    EntityActionPayload,
} from './lib';
export {
    EntityCacheAction,
    EntityCacheQuerySet,
    ClearCollections,
    LoadCollections,
    MergeQuerySet,
    SetEntityCache,
    SaveEntities,
    SaveEntitiesCancel,
    SaveEntitiesCanceled,
    SaveEntitiesError,
    SaveEntitiesSuccess,
} from './lib';
export {
    ChangeSetOperation,
    ChangeSetAdd,
    ChangeSetDelete,
    ChangeSetUpdate,
    ChangeSetUpsert,
    ChangeSetItem,
    ChangeSet,
    ChangeSetItemFactory,
    changeSetItemFactory,
    excludeEmptyChangeSetItems,
} from './lib';

export {
    EntityOp,
    OP_SUCCESS,
    OP_ERROR,
    makeErrorOp,
    makeSuccessOp,
} from './lib';
export { MergeStrategy } from './lib';
export { UpdateResponseData } from './lib';

// // dataservices
export { DataServiceError } from './lib/';
export {
    EntityActionDataServiceError,
} from './lib';
export {
    DefaultDataServiceConfig,
} from './lib';
export { DefaultDataService } from './lib';
export { DefaultDataServiceFactory } from './lib';
export {
    EntityCacheDataService,
} from './lib';
export { EntityDataService } from './lib';
export { EntityHttpResourceUrls } from './lib';
export { HttpResourceUrls } from './lib';
export { HttpUrlGenerator } from './lib';
export { DefaultHttpUrlGenerator } from './lib';
export { normalizeRoot } from './lib';
export {
    EntityCollectionDataService,
    HttpMethods,
    RequestData,
    QueryParams,
} from './lib';
export {
    PersistenceResultHandler,
    DefaultPersistenceResultHandler,
} from './lib';

// // dispatchers
export { EntityCacheDispatcher } from './lib';
export {
    EntityServerCommands,
    EntityCacheCommands,
    EntityCommands,
} from './lib';
export { EntityDispatcherBase } from './lib';
export {
    EntityDispatcherDefaultOptions,
} from './lib';
export {
    EntityDispatcherFactory,
} from './lib';
export {
    EntityDispatcher,
    PersistanceCanceled,
} from './lib';

// // effects
export { EntityCacheEffects } from './lib';
export { persistOps, EntityEffects } from './lib';

// // entity-metadata
export {
    EntityDefinitions,
    EntityDefinitionService,
} from './lib';
export {
    EntityDefinition,
    createEntityDefinition,
} from './lib';
export {
    EntityFilterFn,
    PropsFilterFnFactory,
} from './lib';
export {
    ENTITY_METADATA_TOKEN,
    EntityMetadata,
    EntityMetadataMap,
} from './lib';

// // entity-services
export {
    EntityCollectionServiceBase,
} from './lib';
export {
    EntityCollectionServiceElements,
    EntityCollectionServiceElementsFactory,
} from './lib';
export {
    EntityCollectionServiceFactory,
} from './lib';
export {
    EntityCollectionService,
} from './lib';
export { EntityServicesBase } from './lib';
export {
    EntityServicesElements,
} from './lib';
export {
    EntityServices,
    EntityCollectionServiceMap,
} from './lib';

// // reducers
export {
    ENTITY_CACHE_NAME,
    ENTITY_CACHE_NAME_TOKEN,
    ENTITY_CACHE_META_REDUCERS,
    ENTITY_COLLECTION_META_REDUCERS,
    INITIAL_ENTITY_CACHE_STATE,
} from './lib';
export { EntityCacheReducerFactory } from './lib';
export { EntityCache } from './lib';
export { EntityChangeTrackerBase } from './lib';
export { EntityChangeTracker } from './lib';
export {
    EntityCollectionCreator,
    createEmptyEntityCollection,
} from './lib';
export {
    EntityCollectionReducerMethodMap,
    EntityCollectionReducerMethods,
    EntityCollectionReducerMethodsFactory,
} from './lib';
export {
    EntityCollectionReducers,
    EntityCollectionReducerRegistry,
} from './lib';
export {
    EntityCollectionReducer,
    EntityCollectionReducerFactory,
} from './lib';
export {
    ChangeType,
    ChangeState,
    ChangeStateMap,
    EntityCollection,
} from './lib';

// // selectors
export {
    ENTITY_CACHE_SELECTOR_TOKEN,
    entityCacheSelectorProvider,
    EntityCacheSelector,
    createEntityCacheSelector,
} from './lib';
export {
    CollectionSelectors,
    EntitySelectors,
    EntitySelectorsFactory,
} from './lib';
export {
    EntitySelectors$,
    EntitySelectors$Factory,
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
    EntityDataModuleConfig,
    EntityDataModuleWithoutEffects,
} from './lib';
export { EntityDataModule } from './lib';
