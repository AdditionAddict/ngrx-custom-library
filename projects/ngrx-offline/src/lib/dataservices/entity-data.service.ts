import { Injectable } from '@angular/core';

import { NxaEntityCollectionDataService } from './interfaces';
import { NxaDefaultDataServiceFactory } from './default-data.service';

/**
 * Registry of EntityCollection data services that make REST-like CRUD calls
 * to entity collection endpoints.
 */
@Injectable()
export class NxaEntityDataService {
    protected services: { [name: string]: NxaEntityCollectionDataService<any> } = {};

    // TODO:  Optionally inject specialized entity data services
    // for those that aren't derived from BaseDataService.
    constructor(protected defaultDataServiceFactory: NxaDefaultDataServiceFactory) { }

    /**
     * Get (or create) a data service for entity type
     * @param entityName - the name of the type
     *
     * Examples:
     *   getService('Hero'); // data service for Heroes, untyped
     *   getService<Hero>('Hero'); // data service for Heroes, typed as Hero
     */
    getService<T>(entityName: string): NxaEntityCollectionDataService<T> {
        entityName = entityName.trim();
        let service = this.services[entityName];
        if (!service) {
            service = this.defaultDataServiceFactory.create(entityName);
            this.services[entityName] = service;
        }
        return service;
    }

    /**
     * Register an NxaEntityCollectionDataService for an entity type
     * @param entityName - the name of the entity type
     * @param service - data service for that entity type
     *
     * Examples:
     *   registerService('Hero', myHeroDataService);
     *   registerService('Villain', myVillainDataService);
     */
    registerService<T>(
        entityName: string,
        service: NxaEntityCollectionDataService<T>
    ) {
        this.services[entityName.trim()] = service;
    }

    /**
     * Register a batch of data services.
     * @param services - data services to merge into existing services
     *
     * Examples:
     *   registerServices({
     *     Hero: myHeroDataService,
     *     Villain: myVillainDataService
     *   });
     */
    registerServices(services: {
        [name: string]: NxaEntityCollectionDataService<any>;
    }) {
        this.services = { ...this.services, ...services };
    }
}