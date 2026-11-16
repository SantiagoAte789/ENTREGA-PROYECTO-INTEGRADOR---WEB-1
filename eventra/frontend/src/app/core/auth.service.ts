import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Rol, Usuario } from './models/persona.model';

const KEY = 'eventra_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  usuario = signal<Usuario | null>(this.cargar());

  private cargar(): Usuario | null {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? (JSON.parse(raw) as Usuario) : null;
    } catch {
      return null;
    }
  }

  login(correo: string, password: string) {
    return this.http.post<Usuario>(`${environment.apiUrl}/auth/login`, { correo, password }).pipe(
      tap((u) => {
        localStorage.setItem(KEY, JSON.stringify(u));
        this.usuario.set(u);
      })
    );
  }

  register(data: Record<string, unknown>) {
    return this.http.post<Usuario>(`${environment.apiUrl}/auth/register`, data);
  }

  logout() {
    localStorage.removeItem(KEY);
    this.usuario.set(null);
    this.router.navigate(['/login']);
  }

  homeFor(rol: Rol): string {
    if (rol === 'administrador') return '/admin/dashboard';
    return rol === 'agente' ? '/agente/eventos' : '/cliente/eventos';
  }
}
