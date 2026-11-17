import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards';
import { CrudPageComponent } from '../../shared/crud-page/crud-page.component';
import { AGENTES_CONFIG, EVENTOS_ADMIN_CONFIG, EVENTOS_AGENTE_CONFIG } from './agentes.config';
import { AgenteReservasComponent } from './agente-reservas.component';

const admin = [roleGuard('administrador')];
const agente = [roleGuard('agente')];

export const AGENTES_ROUTES: Routes = [
  // Perfil agente
  { path: 'agente/eventos', component: CrudPageComponent, canActivate: agente, data: { config: EVENTOS_AGENTE_CONFIG } },
  { path: 'agente/reservas', component: AgenteReservasComponent, canActivate: agente },
  // Administración (CRUD)
  { path: 'admin/agentes', component: CrudPageComponent, canActivate: admin, data: { config: AGENTES_CONFIG } },
  { path: 'admin/eventos', component: CrudPageComponent, canActivate: admin, data: { config: EVENTOS_ADMIN_CONFIG } }
];
