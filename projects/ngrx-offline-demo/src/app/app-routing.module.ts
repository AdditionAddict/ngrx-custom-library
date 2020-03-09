import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'missions' },
  {
    path: 'missions',
    loadChildren: () => import('./missions/missions.module').then(m => m.MissionsModule)
  },
  {
    path: 'celestial-bodies',
    loadChildren: () => import('./celestial-bodies/celestial-bodies.module').then(m => m.CelestialBodiesModule)
  },
  { path: '**', redirectTo: 'missions' } // bad routes redirect to missions
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
