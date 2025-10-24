import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { PlayersListComponent } from './pages/players-list/players-list.component';
import { PlayerDetailComponent } from './pages/player-detail/player-detail.component';
import { PlayerFormComponent } from './pages/player-form/player-form.component';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'players', component: PlayersListComponent },
  { path: 'players/:id', component: PlayerDetailComponent },
  { path: 'admin/new', component: PlayerFormComponent, canActivate: [authGuard] },
  { path: 'admin/edit/:id', component: PlayerFormComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'players' },
  { path: '**', redirectTo: 'players' }
];
