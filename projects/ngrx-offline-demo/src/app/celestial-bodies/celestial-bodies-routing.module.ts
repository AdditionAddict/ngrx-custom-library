import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewBodyPageComponent } from './containers';


const routes: Routes = [
  {
    path: ':id',
    component: ViewBodyPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CelestialBodiesRoutingModule { }
