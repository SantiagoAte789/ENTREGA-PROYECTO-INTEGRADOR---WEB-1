import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { LOCALIZACION_ROUTES } from './features/localizacion/localizacion.routes';
import { CLIENTES_ROUTES } from './features/clientes/clientes.routes';
import { AGENTES_ROUTES } from './features/agentes/agentes.routes';
import { ADMINISTRADORES_ROUTES } from './features/administradores/administradores.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  ...LOCALIZACION_ROUTES,
  ...CLIENTES_ROUTES,
  ...AGENTES_ROUTES,
  ...ADMINISTRADORES_ROUTES,
  { path: '**', redirectTo: 'login' }
];
