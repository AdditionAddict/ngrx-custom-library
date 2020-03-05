import { ModuleWithProviders, NgModule } from '@angular/core';

import { EffectsModule, EffectSources } from '@ngrx/effects';

import { NxaDefaultDataServiceFactory } from './dataservices/default-data.service';

import {
    DefaultNxaPersistenceResultHandler,
    NxaPersistenceResultHandler,
} from './dataservices/persistence-result-handler.service';

import {
    NxaDefaultHttpUrlGenerator,
    NxaHttpUrlGenerator,
} from './dataservices/http-url-generator';

import { NxaEntityCacheDataService } from './dataservices/entity-cache-data.service';
import { NxaEntityCacheEffects } from './effects/entity-cache-effects';
import { NxaEntityDataService } from './dataservices/entity-data.service';
import { NxaEntityEffects } from './effects/entity-effects';

import { NXA_ENTITY_METADATA_TOKEN } from './entity-metadata/entity-metadata';

import {
    NXA_ENTITY_CACHE_META_REDUCERS,
    NXA_ENTITY_COLLECTION_META_REDUCERS,
} from './reducers/constants';
import { Pluralizer, PLURAL_NAMES_TOKEN } from './utils/interfaces';
import { DefaultPluralizer } from './utils/default-pluralizer';

import {
    NxaEntityDataModuleConfig,
    NxaEntityDataModuleWithoutEffects,
} from './entity-data-without-effects.module';
import { NxaDefaultOfflineServiceFactory } from './offline-services/default-offline.service';
import { NxaEntityOfflineService } from './offline-services/entity-offline.service';
import { DefaultNxaOfflinePersistenceResultHandler, NxaOfflinePersistenceResultHandler } from './offline-services/offline-persistence-result-handler.service';

/**
 * entity-data main module includes effects and HTTP data services
 * Configure with `forRoot`.
 * No `forFeature` yet.
 */
@NgModule({
    imports: [
        NxaEntityDataModuleWithoutEffects,
        EffectsModule, // do not supply effects because can't replace later
    ],
    providers: [
        NxaDefaultDataServiceFactory,
        NxaDefaultOfflineServiceFactory,
        NxaEntityCacheDataService,
        NxaEntityDataService,
        NxaEntityOfflineService,
        NxaEntityCacheEffects,
        NxaEntityEffects,
        { provide: NxaHttpUrlGenerator, useClass: NxaDefaultHttpUrlGenerator },
        {
            provide: NxaPersistenceResultHandler,
            useClass: DefaultNxaPersistenceResultHandler,
        },
        {
            provide: NxaOfflinePersistenceResultHandler,
            useClass: DefaultNxaOfflinePersistenceResultHandler,
        },
        { provide: Pluralizer, useClass: DefaultPluralizer },
    ],
})
export class NxaEntityDataModule {
    static forRoot(
        config: NxaEntityDataModuleConfig
    ): ModuleWithProviders<NxaEntityDataModule> {
        return {
            ngModule: NxaEntityDataModule,
            providers: [
                // TODO: Moved these effects classes up to EntityDataModule itself
                // Remove this comment if that was a mistake.
                // NxaEntityCacheEffects,
                // NxaEntityEffects,
                {
                    provide: NXA_ENTITY_METADATA_TOKEN,
                    multi: true,
                    useValue: config.entityMetadata ? config.entityMetadata : [],
                },
                {
                    provide: NXA_ENTITY_CACHE_META_REDUCERS,
                    useValue: config.entityCacheMetaReducers
                        ? config.entityCacheMetaReducers
                        : [],
                },
                {
                    provide: NXA_ENTITY_COLLECTION_META_REDUCERS,
                    useValue: config.entityCollectionMetaReducers
                        ? config.entityCollectionMetaReducers
                        : [],
                },
                {
                    provide: PLURAL_NAMES_TOKEN,
                    multi: true,
                    useValue: config.pluralNames ? config.pluralNames : {},
                },
            ],
        };
    }

    constructor(
        private effectSources: EffectSources,
        entityCacheEffects: NxaEntityCacheEffects,
        entityEffects: NxaEntityEffects
    ) {
        // We can't use `forFeature()` because, if we did, the developer could not
        // replace the entity-data `NxaEntityEffects` with a custom alternative.
        // Replacing that class is an extensibility point we need.
        //
        // The FEATURE_EFFECTS token is not exposed, so can't use that technique.
        // Warning: this alternative approach relies on an undocumented API
        // to add effect directly rather than through `forFeature()`.
        // The danger is that EffectsModule.forFeature evolves and we no longer perform a crucial step.
        this.addEffects(entityCacheEffects);
        this.addEffects(entityEffects);
    }

    /**
     * Add another class instance that contains effects.
     * @param effectSourceInstance a class instance that implements effects.
     * Warning: undocumented @ngrx/effects API
     */
    addEffects(effectSourceInstance: any) {
        this.effectSources.addEffects(effectSourceInstance);
    }
}