import { Inject, Injectable, Optional } from '@angular/core';

import { createNxaEntityDefinition, NxaEntityDefinition } from './entity-definition';
import {
    NxaEntityMetadata,
    NxaEntityMetadataMap,
    NXA_ENTITY_METADATA_TOKEN,
} from './entity-metadata';

export interface NxaEntityDefinitions {
    [entityName: string]: NxaEntityDefinition<any>;
}

/** Registry of NxaEntityDefinitions for all cached entity types */
@Injectable()
export class NxaEntityDefinitionService {
    /** {NxaEntityDefinition} for all cached entity types */
    private readonly definitions: NxaEntityDefinitions = {};

    constructor(
        @Optional()
        @Inject(NXA_ENTITY_METADATA_TOKEN)
        entityMetadataMaps: NxaEntityMetadataMap[]
    ) {
        if (entityMetadataMaps) {
            entityMetadataMaps.forEach(map => this.registerMetadataMap(map));
        }
    }

    /**
     * Get (or create) a data service for entity type
     * @param entityName - the name of the type
     *
     * Examples:
     *   getDefinition('Hero'); // definition for Heroes, untyped
     *   getDefinition<Hero>(`Hero`); // definition for Heroes, typed with Hero interface
     */
    getDefinition<T>(
        entityName: string,
        shouldThrow = true
    ): NxaEntityDefinition<T> {
        entityName = entityName.trim();
        const definition = this.definitions[entityName];
        if (!definition && shouldThrow) {
            throw new Error(`No NxaEntityDefinition for entity type "${entityName}".`);
        }
        return definition;
    }

    //////// Registration methods //////////

    /**
     * Create and register the {NxaEntityDefinition} for the {NxaEntityMetadata} of an entity type
     * @param name - the name of the entity type
     * @param definition - {NxaEntityMetadata} for a collection for that entity type
     *
     * Examples:
     *   registerMetadata(myHeroNxaEntityDefinition);
     */
    registerMetadata(metadata: NxaEntityMetadata) {
        if (metadata) {
            const definition = createNxaEntityDefinition(metadata);
            this.registerDefinition(definition);
        }
    }

    /**
     * Register an NxaEntityMetadataMap.
     * @param metadataMap - a map of entityType names to entity metadata
     *
     * Examples:
     *   registerMetadataMap({
     *     'Hero': myHeroMetadata,
     *     Villain: myVillainMetadata
     *   });
     */
    registerMetadataMap(metadataMap: NxaEntityMetadataMap = {}) {
        // The entity type name should be the same as the map key
        Object.keys(metadataMap || {}).forEach(entityName =>
            this.registerMetadata({ entityName, ...metadataMap[entityName] })
        );
    }

    /**
     * Register an {NxaEntityDefinition} for an entity type
     * @param definition - NxaEntityDefinition of a collection for that entity type
     *
     * Examples:
     *   registerDefinition('Hero', myHeroNxaEntityDefinition);
     */
    registerDefinition<T>(definition: NxaEntityDefinition<T>) {
        this.definitions[definition.entityName] = definition;
    }

    /**
     * Register a batch of NxaEntityDefinitions.
     * @param definitions - map of entityType name and associated NxaEntityDefinitions to merge.
     *
     * Examples:
     *   registerDefinitions({
     *     'Hero': myHeroNxaEntityDefinition,
     *     Villain: myVillainNxaEntityDefinition
     *   });
     */
    registerDefinitions(definitions: NxaEntityDefinitions) {
        Object.assign(this.definitions, definitions);
    }
}