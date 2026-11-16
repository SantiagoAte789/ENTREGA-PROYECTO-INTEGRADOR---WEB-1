import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../core/auth.service';

interface NavLink { path: string; label: string; }

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand bg-dark navbar-dark px-3 flex-wrap">
      <a class="navbar-brand fw-bold" routerLink="/">Eventra</a>
      <ul class="navbar-nav flex-wrap me-auto">
        @for (l of links(); track l.path) {
          <li class="nav-item">
            <a class="nav-link" [routerLink]="l.path" routerLinkActive="active">{{ l.label }}</a>
          </li>
        }
      </ul>
      @if (auth.usuario(); as u) {
        <span class="text-light me-3 small">{{ u.nombre_completo }} ({{ u.rol }})</span>
        <button class="btn btn-outline-light btn-sm" (click)="auth.logout()">Salir</button>
      }
    </nav>
  `
})
export class NavbarComponent {
  auth = inject(AuthService);

  links = computed<NavLink[]>(() => {
    const u = this.auth.usuario();
    if (!u) {
      return [{ path: '/login', label: 'Ingresar' }, { path: '/registro', label: 'Registrarse' }];
    }
    if (u.rol === 'cliente') {
      return [{ path: '/cliente/eventos', label: 'Eventos' }, { path: '/cliente/reservas', label: 'Mis reservas' }];
    }
    if (u.rol === 'agente') {
      return [{ path: '/agente/eventos', label: 'Eventos' }, { path: '/agente/reservas', label: 'Reservas' }];
    }
    return [
      { path: '/admin/dashboard', label: 'Dashboard' },
      { path: '/admin/paises', label: 'Países' },
      { path: '/admin/departamentos', label: 'Departamentos' },
      { path: '/admin/ciudades', label: 'Ciudades' },
      { path: '/admin/personas', label: 'Personas' },
      { path: '/admin/clientes', label: 'Clientes' },
      { path: '/admin/agentes', label: 'Agentes' },
      { path: '/admin/administradores', label: 'Administradores' },
      { path: '/admin/eventos', label: 'Eventos' },
      { path: '/admin/reservas', label: 'Reservas' }
    ];
  });
}
