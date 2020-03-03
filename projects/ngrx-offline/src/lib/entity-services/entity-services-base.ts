import { Injectable } from '@angular/core';
import { Action, Store } from '@ngrx/store';

import { Observable } from 'rxjs';

import { NxaEntityAction } from '../actions/entity-action';
import { NxaEntityCache } from '../reducers/entity-cache';
import { NxaEntityCollectionService } from './entity-collection-service';
import { NxaEntityCollectionServiceFactory } from './entity-collection-service-factory';
import { NxaEntityCollectionServiceMap, NxaEntityServices } from './entity-services';
import { NxaEntitySelectors$ } from '../selectors/entity-selectors$';
import { NxaEntityServicesElements } from './entity-services-elements';

// tslint:disable:member-ordering

/**
 * Base/default class of a central registry of EntityCollectionServices for all entity types.
 * Create your own subclass to add app-specific members for an improved developer experience.
 *
 * @example
 * export class EntityServices extends NxaEntityServicesBase {
 *   constructor(entityServicesElements: NxaEntityServicesElements) {
 *     super(entityServicesElements);
 *   }
 *   // Extend with well-known, app entity collection services
 *   // Convenience property to return a typed custom entity collection service
 *   get companyService() {
 *     return this.getEntityCollectionService<Model.Company>('Company') as CompanyService;
 *   }
 *   // Convenience dispatch methods
 *   clearCompany(companyId: string) {
 *     this.dispatch(new ClearCompanyAction(companyId));
 *   }
 * }
 */
@Injectable()
export class NxaEntityServicesBase implements NxaEntityServices {
    // Dear @@ngrx/action developer: think hard before changing the constructor.
    // Doing so will break apps that derive from this base class,
    // and many apps will derive from this class.
    //
    // Do not give this constructor an implementation.
    // Doing so makes it hard to mock classes that derive from this class.
    // Use getter properties instead. For example, see entityCache$
    constructor(private entityServicesElements: NxaEntityServicesElements) { }

    // #region EntityServicesElement-based properties

    /** Observable of error NxaEntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
    get NxaEntityActionErrors$(): Observable<NxaEntityAction> {
        return this.entityServicesElements.NxaEntityActionErrors$;
    }

    /** Observable of the entire entity cache */
    get entityCache$(): Observable<NxaEntityCache> | Store<NxaEntityCache> {
        return this.entityServicesElements.entityCache$;
    }

    /** Factory to create a default instance of an EntityCollectionService */
    get entityCollectionServiceFactory(): NxaEntityCollectionServiceFactory {
        return this.entityServicesElements.entityCollectionServiceFactory;
    }

    /**
     * Actions scanned by the store after it processed them with reducers.
     * A replay observable of the most recent action reduced by the store.
     */
    get reducedActions$(): Observable<Action> {
        return this.entityServicesElements.reducedActions$;
    }

    /** The ngrx store, scoped to the NxaEntityCache */
    protected get store(): Store<NxaEntityCache> {
        return this.entityServicesElements.store;
    }

    // #endregion EntityServicesElement-based properties

    /** Dispatch any action to the store */
    dispatch(action: Action) {
        this.store.dispatch(action);
    }

    /** Registry of EntityCollectionService instances */
    private readonly EntityCollectionServices: NxaEntityCollectionServiceMap = {};

    /**
     * Create a new default instance of an EntityCollectionService.
     * Prefer getEntityCollectionService() unless you really want a new default instance.
     * This one will NOT be registered with EntityServices!
     * @param entityName {string} Name of the entity type of the service
     */
    protected createEntityCollectionService<
        T,
        S$ extends NxaEntitySelectors$<T> = NxaEntitySelectors$<T>
    >(entityName: string): NxaEntityCollectionService<T> {
        return this.entityCollectionServiceFactory.create<T, S$>(entityName);
    }

    /** Get (or create) the singleton instance of an EntityCollectionService
     * @param entityName {string} Name of the entity type of the service
     */
    getEntityCollectionService<
        T,
        S$ extends NxaEntitySelectors$<T> = NxaEntitySelectors$<T>
    >(entityName: string): NxaEntityCollectionService<T> {
        let service = this.EntityCollectionServices[entityName];
        if (!service) {
            service = this.createEntityCollectionService<T, S$>(entityName);
            this.EntityCollectionServices[entityName] = service;
        }
        return service;
    }

    /** Register an EntityCollectionService under its entity type name.
     * Will replace a pre-existing service for that type.
     * @param service {EntityCollectionService} The entity service
     * @param serviceName {string} optional service name to use instead of the service's entityName
     */
    registerEntityCollectionService<T>(
        service: NxaEntityCollectionService<T>,
        serviceName?: string
    ) {
        this.EntityCollectionServices[serviceName || service.entityName] = service;
    }

    /**
     * Register entity services for several entity types at once.
     * Will replace a pre-existing service for that type.
     * @param entityCollectionServices {NxaEntityCollectionServiceMap | EntityCollectionService<any>[]}
     * EntityCollectionServices to register, either as a map or an array
     */
    registerEntityCollectionServices(
        entityCollectionServices:
            | NxaEntityCollectionServiceMap
            | NxaEntityCollectionService<any>[]
    ): void {
        if (Array.isArray(entityCollectionServices)) {
            entityCollectionServices.forEach(service =>
                this.registerEntityCollectionService(service)
            );
        } else {
            Object.keys(entityCollectionServices || {}).forEach(serviceName => {
                this.registerEntityCollectionService(
                    entityCollectionServices[serviceName],
                    serviceName
                );
            });
        }
    }
}