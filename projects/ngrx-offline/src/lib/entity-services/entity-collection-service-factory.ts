import { Injectable } from '@angular/core';
import { NxaEntityCollectionService } from './entity-collection-service';
import { NxaEntityCollectionServiceBase } from './entity-collection-service-base';
import { NxaEntityCollectionServiceElementsFactory } from './entity-collection-service-elements-factory';
import { NxaEntitySelectors$ } from '../selectors/entity-selectors$';

/**
 * Creates EntityCollectionService instances for
 * a cached collection of T entities in the ngrx store.
 */
@Injectable()
export class NxaEntityCollectionServiceFactory {
    constructor(
        /** Creates the core elements of the EntityCollectionService for an entity type. */
        public entityCollectionServiceElementsFactory: NxaEntityCollectionServiceElementsFactory
    ) { }

    /**
     * Create an EntityCollectionService for an entity type
     * @param entityName - name of the entity type
     */
    create<T, S$ extends NxaEntitySelectors$<T> = NxaEntitySelectors$<T>>(
        entityName: string
    ): NxaEntityCollectionService<T> {
        return new NxaEntityCollectionServiceBase<T, S$>(
            entityName,
            this.entityCollectionServiceElementsFactory
        );
    }
}