import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MissionsRoutingModule } from './missions-routing.module';


import { MissionsPageComponent, ViewMissionPageComponent, UpsertMissionPageComponent } from './containers';


export const CONTAINERS = [
  MissionsPageComponent,
  ViewMissionPageComponent,
  UpsertMissionPageComponent
];

@NgModule({
  declarations: [CONTAINERS],
  imports: [
    CommonModule,
    MissionsRoutingModule
  ]
})
export class MissionsModule { }
