import { InjectionToken, Optional, FactoryProvider } from '@angular/core';
import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { NxaEntityCache } from '../reducers/entity-cache';
import {
    NXA_ENTITY_CACHE_NAME,
    NXA_ENTITY_CACHE_NAME_TOKEN,
} from '../reducers/constants';

export const NXA_ENTITY_CACHE_SELECTOR_TOKEN = new InjectionToken<
    MemoizedSelector<Object, NxaEntityCache>
>('@@ngrx/action/entity-cache-selector');

export const nxaEntityCacheSelectorProvider: FactoryProvider = {
    provide: NXA_ENTITY_CACHE_SELECTOR_TOKEN,
    useFactory: createNxaEntityCacheSelector,
    deps: [[new Optional(), NXA_ENTITY_CACHE_NAME_TOKEN]],
};

export type NxaEntityCacheSelector = MemoizedSelector<Object, NxaEntityCache>;

export function createNxaEntityCacheSelector(
    entityCacheName?: string
): MemoizedSelector<Object, NxaEntityCache> {
    entityCacheName = entityCacheName || NXA_ENTITY_CACHE_NAME;
    return createFeatureSelector<NxaEntityCache>(entityCacheName);
}