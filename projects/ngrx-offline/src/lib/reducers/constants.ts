import { InjectionToken } from '@angular/core';
import { MetaReducer } from '@ngrx/store';
import { NxaEntityCache } from './entity-cache';

export const NXA_ENTITY_CACHE_NAME = 'entityCache';
export const NXA_ENTITY_CACHE_NAME_TOKEN = new InjectionToken<string>(
    '@@ngrx/action/entity-cache-name'
);

export const NXA_ENTITY_CACHE_META_REDUCERS = new InjectionToken<
    MetaReducer<any, any>[]
>('@@ngrx/action/entity-cache-meta-reducers');
export const NXA_ENTITY_COLLECTION_META_REDUCERS = new InjectionToken<
    MetaReducer<any, any>[]
>('@@ngrx/action/entity-collection-meta-reducers');

export const INITIAL_NXA_ENTITY_CACHE_STATE = new InjectionToken<
    NxaEntityCache | (() => NxaEntityCache)
>('@@ngrx/action/initial-entity-cache-state');