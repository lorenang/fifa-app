import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { PlayersListComponent } from './pages/players-list/players-list.component';
import { PlayerDetailComponent } from './pages/player-detail/player-detail.component';
import { PlayerFormComponent } from './pages/player-form/player-form.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },                  // pública
  { path: 'players', component: PlayersListComponent },          // pública
  { path: 'players/:id', component: PlayerDetailComponent },     // pública
  { path: 'admin/new', component: PlayerFormComponent, canActivate: [authGuard] },      // protegida
  { path: 'admin/edit/:id', component: PlayerFormComponent, canActivate: [authGuard] }, // protegida
  { path: '', pathMatch: 'full', redirectTo: 'players' },        // default
  { path: '**', redirectTo: 'players' }                          // comodín
];
