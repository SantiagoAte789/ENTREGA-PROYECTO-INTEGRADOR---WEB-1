import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards';
import { CrudPageComponent } from '../../shared/crud-page/crud-page.component';
import { CIUDADES_CONFIG, DEPARTAMENTOS_CONFIG, PAISES_CONFIG } from './localizacion.config';

const admin = [roleGuard('administrador')];

export const LOCALIZACION_ROUTES: Routes = [
  { path: 'admin/paises', component: CrudPageComponent, canActivate: admin, data: { config: PAISES_CONFIG } },
  { path: 'admin/departamentos', component: CrudPageComponent, canActivate: admin, data: { config: DEPARTAMENTOS_CONFIG } },
  { path: 'admin/ciudades', component: CrudPageComponent, canActivate: admin, data: { config: CIUDADES_CONFIG } }
];
