import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  MissionsPageComponent,
  ViewMissionPageComponent,
  UpsertMissionPageComponent
} from './containers';

const routes: Routes = [
  {
    path: '',
    component: MissionsPageComponent
  },
  {
    path: 'create',
    component: UpsertMissionPageComponent
  },
  {
    path: 'update/:id',
    component: UpsertMissionPageComponent
  },
  {
    path: ':id',
    component: ViewMissionPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissionsRoutingModule { }
