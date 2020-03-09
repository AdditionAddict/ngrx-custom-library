import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CelestialBodiesRoutingModule } from './celestial-bodies-routing.module';
import { ViewBodyPageComponent } from './containers/view-body-page/view-body-page.component';

export const CONTAINERS = [
  ViewBodyPageComponent
]

@NgModule({
  declarations: [CONTAINERS],
  imports: [
    CommonModule,
    CelestialBodiesRoutingModule
  ]
})
export class CelestialBodiesModule { }
