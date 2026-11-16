import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards';
import { CrudPageComponent } from '../../shared/crud-page/crud-page.component';
import { ClienteEventosComponent } from './cliente-eventos.component';
import { ClienteReservasComponent } from './cliente-reservas.component';
import { CLIENTES_CONFIG, PERSONAS_CONFIG, RESERVAS_CONFIG } from './clientes.config';

const admin = [roleGuard('administrador')];
const cliente = [roleGuard('cliente')];

export const CLIENTES_ROUTES: Routes = [
  // Perfil cliente
  { path: 'cliente/eventos', component: ClienteEventosComponent, canActivate: cliente },
  { path: 'cliente/reservas', component: ClienteReservasComponent, canActivate: cliente },
  // Administración (CRUD)
  { path: 'admin/personas', component: CrudPageComponent, canActivate: admin, data: { config: PERSONAS_CONFIG } },
  { path: 'admin/clientes', component: CrudPageComponent, canActivate: admin, data: { config: CLIENTES_CONFIG } },
  { path: 'admin/reservas', component: CrudPageComponent, canActivate: admin, data: { config: RESERVAS_CONFIG } }
];
