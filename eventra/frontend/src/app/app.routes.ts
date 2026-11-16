import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login.component';
import { RegisterComponent } from './features/auth/register.component';
import { LOCALIZACION_ROUTES } from './features/localizacion/localizacion.routes';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  ...LOCALIZACION_ROUTES,
  { path: '**', redirectTo: 'login' }
];
