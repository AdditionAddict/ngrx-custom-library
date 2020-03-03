import { Injectable, Optional } from '@angular/core';

import { NxaEntityCollection } from './entity-collection';
import { NxaEntityDefinitionService } from '../entity-metadata/entity-definition.service';

@Injectable()
export class NxaEntityCollectionCreator {
    constructor(
        @Optional() private entityDefinitionService?: NxaEntityDefinitionService
    ) { }

    /**
     * Create the default collection for an entity type.
     * @param entityName {string} entity type name
     */
    create<T = any, S extends NxaEntityCollection<T> = NxaEntityCollection<T>>(
        entityName: string
    ): S {
        const def =
            this.entityDefinitionService &&
            this.entityDefinitionService.getDefinition<T>(
                entityName,
                false /*shouldThrow*/
            );

        const initialState = def && def.initialState;

        return <S>(initialState || createEmptyNxaEntityCollection<T>(entityName));
    }
}

export function createEmptyNxaEntityCollection<T>(
    entityName?: string
): NxaEntityCollection<T> {
    return {
        entityName,
        ids: [],
        entities: {},
        filter: undefined,
        loaded: false,
        loading: false,
        changeState: {},
    } as NxaEntityCollection<T>;
}