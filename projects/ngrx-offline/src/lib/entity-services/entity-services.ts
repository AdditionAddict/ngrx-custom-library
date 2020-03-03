import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { NxaEntityAction } from '../actions/entity-action';
import { NxaEntityCache } from '../reducers/entity-cache';
import { NxaEntityCollectionService } from './entity-collection-service';

// tslint:disable:member-ordering

/**
 * Class-Interface for NxaEntityCache and EntityCollection services.
 * Serves as an Angular provider token for this service class.
 * Includes a registry of EntityCollectionServices for all entity types.
 * Creates a new default EntityCollectionService for any entity type not in the registry.
 * Optionally register specialized EntityCollectionServices for individual types
 */
export abstract class NxaEntityServices {
    /** Dispatch any action to the store */
    abstract dispatch(action: Action): void;

    /** Observable of error NxaEntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
    abstract readonly NxaEntityActionErrors$: Observable<NxaEntityAction>;

    /** Observable of the entire entity cache */
    abstract readonly entityCache$: Observable<NxaEntityCache> | Store<NxaEntityCache>;

    /** Get (or create) the singleton instance of an EntityCollectionService
     * @param entityName {string} Name of the entity type of the service
     */
    abstract getEntityCollectionService<T = any>(
        entityName: string
    ): NxaEntityCollectionService<T>;

    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent Action (not just NxaEntityAction) reduced by the store.
     */
    abstract readonly reducedActions$: Observable<Action>;

    // #region EntityCollectionService creation and registration API

    /** Register an EntityCollectionService under its entity type name.
     * Will replace a pre-existing service for that type.
     * @param service {EntityCollectionService} The entity service
     */
    abstract registerEntityCollectionService<T>(
        service: NxaEntityCollectionService<T>
    ): void;

    /** Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @param entityCollectionServices Array of EntityCollectionServices to register
     */
    abstract registerEntityCollectionServices(
        entityCollectionServices: NxaEntityCollectionService<any>[]
    ): void;

    /** Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @param entityCollectionServiceMap Map of service-name to entity-collection-service
     */
    abstract registerEntityCollectionServices(
        // tslint:disable-next-line:unified-signatures
        entityCollectionServiceMap: NxaEntityCollectionServiceMap
    ): void;
    // #endregion EntityCollectionService creation and registration API
}

/**
 * A map of service or entity names to their corresponding EntityCollectionServices.
 */
export interface NxaEntityCollectionServiceMap {
    [entityName: string]: NxaEntityCollectionService<any>;
}