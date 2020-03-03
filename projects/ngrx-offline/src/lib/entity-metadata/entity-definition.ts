import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Comparer, IdSelector } from '@ngrx/entity';

import { NxaEntityDispatcherDefaultOptions } from '../dispatchers/entity-dispatcher-default-options';
import { defaultSelectId } from '../utils/utilities';
import { NxaEntityCollection } from '../reducers/entity-collection';
import { NxaEntityMetadata } from './entity-metadata';

export interface NxaEntityDefinition<T = any> {
    entityName: string;
    entityAdapter: EntityAdapter<T>;
    entityDispatcherOptions?: Partial<NxaEntityDispatcherDefaultOptions>;
    initialState: NxaEntityCollection<T>;
    metadata: NxaEntityMetadata<T>;
    noChangeTracking: boolean;
    selectId: IdSelector<T>;
    sortComparer: false | Comparer<T>;
}

export function createNxaEntityDefinition<T, S extends object>(
    metadata: NxaEntityMetadata<T, S>
): NxaEntityDefinition<T> {
    let entityName = metadata.entityName;
    if (!entityName) {
        throw new Error('Missing required entityName');
    }
    metadata.entityName = entityName = entityName.trim();
    const selectId = metadata.selectId || defaultSelectId;
    const sortComparer = (metadata.sortComparer = metadata.sortComparer || false);

    const entityAdapter = createEntityAdapter<T>({ selectId, sortComparer });

    const entityDispatcherOptions: Partial<NxaEntityDispatcherDefaultOptions> =
        metadata.entityDispatcherOptions || {};

    const initialState: NxaEntityCollection<T> = entityAdapter.getInitialState({
        entityName,
        filter: '',
        loaded: false,
        loading: false,
        changeState: {},
        ...(metadata.additionalCollectionState || {}),
    });

    const noChangeTracking = metadata.noChangeTracking === true; // false by default

    return {
        entityName,
        entityAdapter,
        entityDispatcherOptions,
        initialState,
        metadata,
        noChangeTracking,
        selectId,
        sortComparer,
    };
}