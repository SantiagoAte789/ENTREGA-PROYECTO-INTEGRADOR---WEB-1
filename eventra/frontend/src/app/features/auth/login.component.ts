import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="container py-5" style="max-width: 440px">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h3 class="mb-3 text-center">Iniciar sesión</h3>
          @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }
          <form (ngSubmit)="entrar()" #f="ngForm">
            <div class="mb-3">
              <label class="form-label" for="correo">Correo</label>
              <input class="form-control" id="correo" name="correo" type="email" [(ngModel)]="correo" required>
            </div>
            <div class="mb-3">
              <label class="form-label" for="password">Contraseña</label>
              <input class="form-control" id="password" name="password" type="password" [(ngModel)]="password" required>
            </div>
            <button class="btn btn-primary w-100" type="submit" [disabled]="f.invalid || loading()">Ingresar</button>
          </form>
          <p class="text-center mt-3 mb-0">¿No tienes cuenta? <a routerLink="/registro">Regístrate</a></p>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  correo = '';
  password = '';
  error = signal('');
  loading = signal(false);

  constructor() {
    const u = this.auth.usuario();
    if (u) this.router.navigate([this.auth.homeFor(u.rol)]);
  }

  entrar(): void {
    this.error.set('');
    this.loading.set(true);
    this.auth.login(this.correo, this.password).subscribe({
      next: (u) => this.router.navigate([this.auth.homeFor(u.rol)]),
      error: (e) => {
        this.error.set(e?.error?.message ?? 'No se pudo iniciar sesión');
        this.loading.set(false);
      }
    });
  }
}
