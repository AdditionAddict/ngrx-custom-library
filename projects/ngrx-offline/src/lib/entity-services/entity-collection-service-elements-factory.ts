import { Injectable } from '@angular/core';
import { NxaEntityDispatcher } from '../dispatchers/entity-dispatcher';
import { NxaEntityDispatcherFactory } from '../dispatchers/entity-dispatcher-factory';
import { NxaEntityDefinitionService } from '../entity-metadata/entity-definition.service';
import {
    NxaEntitySelectors,
    NxaEntitySelectorsFactory,
} from '../selectors/entity-selectors';
import {
    NxaEntitySelectors$,
    NxaEntitySelectors$Factory,
} from '../selectors/entity-selectors$';

/** Core ingredients of an EntityCollectionService */
export interface NxaEntityCollectionServiceElements<
    T,
    S$ extends NxaEntitySelectors$<T> = NxaEntitySelectors$<T>
    > {
    readonly dispatcher: NxaEntityDispatcher<T>;
    readonly entityName: string;
    readonly selectors: NxaEntitySelectors<T>;
    readonly selectors$: S$;
}

/** Creates the core elements of the EntityCollectionService for an entity type. */
@Injectable()
export class NxaEntityCollectionServiceElementsFactory {
    constructor(
        private entityDispatcherFactory: NxaEntityDispatcherFactory,
        private entityDefinitionService: NxaEntityDefinitionService,
        private entitySelectorsFactory: NxaEntitySelectorsFactory,
        private entitySelectors$Factory: NxaEntitySelectors$Factory
    ) { }

    /**
     * Get the ingredients for making an EntityCollectionService for this entity type
     * @param entityName - name of the entity type
     */
    create<T, S$ extends NxaEntitySelectors$<T> = NxaEntitySelectors$<T>>(
        entityName: string
    ): NxaEntityCollectionServiceElements<T, S$> {
        entityName = entityName.trim();
        const definition = this.entityDefinitionService.getDefinition<T>(
            entityName
        );
        const dispatcher = this.entityDispatcherFactory.create<T>(
            entityName,
            definition.selectId,
            definition.entityDispatcherOptions
        );
        const selectors = this.entitySelectorsFactory.create<T>(
            definition.metadata
        );
        const selectors$ = this.entitySelectors$Factory.create<T, S$>(
            entityName,
            selectors
        );
        return {
            dispatcher,
            entityName,
            selectors,
            selectors$,
        };
    }
}