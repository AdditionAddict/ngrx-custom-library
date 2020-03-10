import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NxaEntityDataModule, NxaEntityDefinitionService, NxaEntityDataService } from 'ngrx-offline';
import { entityMetadata } from './entity-metadata'
import { MissionDataService } from './data-services';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NxaEntityDataModule,
  ],
  providers: [
    MissionDataService
  ]
})
export class NgrxStoreModule {
  constructor(
    eds: NxaEntityDefinitionService,
    entityDataService: NxaEntityDataService,
    missionDataService: MissionDataService
  ) {
    eds.registerMetadataMap(entityMetadata);

    entityDataService.registerService('Mission', missionDataService)
  }
}
