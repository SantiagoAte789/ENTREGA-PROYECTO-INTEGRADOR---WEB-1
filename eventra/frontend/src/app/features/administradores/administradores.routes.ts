import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards';
import { CrudPageComponent } from '../../shared/crud-page/crud-page.component';
import { ADMINISTRADORES_CONFIG } from './administradores.config';
import { DashboardComponent } from './dashboard.component';

const admin = [roleGuard('administrador')];

export const ADMINISTRADORES_ROUTES: Routes = [
  { path: 'admin/dashboard', component: DashboardComponent, canActivate: admin },
  { path: 'admin/administradores', component: CrudPageComponent, canActivate: admin, data: { config: ADMINISTRADORES_CONFIG } }
];
