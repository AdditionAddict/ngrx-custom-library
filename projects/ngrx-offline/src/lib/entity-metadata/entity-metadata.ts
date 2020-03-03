import { InjectionToken } from '@angular/core';

import { IdSelector, Comparer } from '@ngrx/entity';

import { NxaEntityDispatcherDefaultOptions } from '../dispatchers/entity-dispatcher-default-options';
import { NxaEntityFilterFn } from './entity-filters';

export const NXA_ENTITY_METADATA_TOKEN = new InjectionToken<NxaEntityMetadataMap>(
    '@@ngrx/action/entity-metadata'
);

/** Metadata that describe an entity type and its collection to @@ngrx/action */
export interface NxaEntityMetadata<T = any, S extends object = {}> {
    entityName: string;
    entityDispatcherOptions?: Partial<NxaEntityDispatcherDefaultOptions>;
    filterFn?: NxaEntityFilterFn<T>;
    noChangeTracking?: boolean;
    selectId?: IdSelector<T>;
    sortComparer?: false | Comparer<T>;
    additionalCollectionState?: S;
}

/** Map entity-type name to its NxaEntityMetadata */
export interface NxaEntityMetadataMap {
    [entityName: string]: Partial<NxaEntityMetadata<any>>;
}