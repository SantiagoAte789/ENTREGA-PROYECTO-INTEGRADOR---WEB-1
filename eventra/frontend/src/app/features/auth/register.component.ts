import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Ciudad } from '../../core/models/localizacion.model';
import { CiudadService } from '../../core/services/localizacion.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="container py-4" style="max-width: 720px">
      <div class="card shadow-sm">
        <div class="card-body p-4">
          <h3 class="mb-3 text-center">Registro</h3>
          @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }
          @if (ok()) { <div class="alert alert-success">Registro exitoso. Redirigiendo al inicio de sesión...</div> }
          <form (ngSubmit)="registrar()" #f="ngForm" class="row g-3">
            <div class="col-md-6">
              <label class="form-label" for="rol">Tipo de usuario</label>
              <select class="form-select" id="rol" name="rol" [(ngModel)]="m.rol" required>
                <option value="cliente">Cliente</option>
                <option value="agente">Agente</option>
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="identificacion">Cédula o pasaporte</label>
              <input class="form-control" id="identificacion" name="identificacion" [(ngModel)]="m.identificacion" required>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="nombre_completo">Nombre completo</label>
              <input class="form-control" id="nombre_completo" name="nombre_completo" [(ngModel)]="m.nombre_completo" required>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="correo">Correo</label>
              <input class="form-control" id="correo" name="correo" type="email" [(ngModel)]="m.correo" required>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="password">Contraseña</label>
              <input class="form-control" id="password" name="password" type="password" [(ngModel)]="m.password" required>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="direccion">Dirección</label>
              <input class="form-control" id="direccion" name="direccion" [(ngModel)]="m.direccion" required>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="id_ciudad">Ciudad</label>
              <select class="form-select" id="id_ciudad" name="id_ciudad" [(ngModel)]="m.id_ciudad" required>
                <option [ngValue]="undefined">-- Seleccione --</option>
                @for (c of ciudades(); track c.id_ciudad) {
                  <option [ngValue]="c.id_ciudad">{{ c.nombre }} - {{ c.departamento }}</option>
                }
              </select>
            </div>
            <div class="col-md-6">
              <label class="form-label" for="telefonos">Teléfonos (separados por coma)</label>
              <input class="form-control" id="telefonos" name="telefonos" [(ngModel)]="m.telefonos">
            </div>
            @if (m.rol === 'agente') {
              <div class="col-md-6">
                <label class="form-label" for="experiencia">Años de experiencia</label>
                <input class="form-control" id="experiencia" name="experiencia" type="number" min="0" [(ngModel)]="m.experiencia">
              </div>
            }
            <div class="col-12">
              <button class="btn btn-primary w-100" type="submit" [disabled]="f.invalid">Registrarme</button>
            </div>
          </form>
          <p class="text-center mt-3 mb-0">¿Ya tienes cuenta? <a routerLink="/login">Inicia sesión</a></p>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private ciudadService = inject(CiudadService);

  ciudades = signal<Ciudad[]>([]);
  error = signal('');
  ok = signal(false);
  m: Record<string, any> = { rol: 'cliente' };

  ngOnInit(): void {
    this.ciudadService.getAll().subscribe({
      next: (c) => this.ciudades.set(c),
      error: () => this.error.set('No se pudieron cargar las ciudades')
    });
  }

  registrar(): void {
    this.error.set('');
    this.auth.register(this.m).subscribe({
      next: () => {
        this.ok.set(true);
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (e) => this.error.set(e?.error?.message ?? 'No se pudo completar el registro')
    });
  }
}
