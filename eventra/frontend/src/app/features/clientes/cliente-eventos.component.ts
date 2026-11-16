import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Evento } from '../../core/models/evento.model';
import { EventoService } from '../../core/services/evento.service';
import { ReservaService } from '../../core/services/reserva.service';
import { badgeClass } from '../../shared/utils';

@Component({
  selector: 'app-cliente-eventos',
  standalone: true,
  imports: [FormsModule, CurrencyPipe, DatePipe, RouterLink],
  template: `
    <div class="container py-4">
      <h3 class="mb-3">Eventos disponibles</h3>
      @if (mensaje()) {
        <div class="alert alert-success">{{ mensaje() }} <a routerLink="/cliente/reservas">Ver mis reservas</a></div>
      }
      @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }

      @if (seleccionado(); as e) {
        <form class="card card-body mb-4 border-primary" (ngSubmit)="confirmar()" #f="ngForm">
          <h5>Reservar: {{ e.nombre }}</h5>
          <div class="row g-3 align-items-end">
            <div class="col-md-3">
              <label class="form-label" for="entradas">Número de entradas</label>
              <input class="form-control" id="entradas" name="entradas" type="number" min="1" [(ngModel)]="entradas" required>
            </div>
            <div class="col-md-5">
              <label class="form-label" for="obs">Observaciones</label>
              <input class="form-control" id="obs" name="obs" [(ngModel)]="observaciones">
            </div>
            <div class="col-md-4">
              <div class="fw-bold">Valor total: {{ total() | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</div>
              <button class="btn btn-success me-2 mt-2" type="submit" [disabled]="f.invalid">Confirmar reserva</button>
              <button class="btn btn-secondary mt-2" type="button" (click)="seleccionado.set(null)">Cancelar</button>
            </div>
          </div>
        </form>
      }

      <div class="row row-cols-1 row-cols-md-3 g-3">
        @for (e of lista(); track e.codigo_evento) {
          <div class="col">
            <div class="card h-100 shadow-sm">
              <div class="card-body">
                <div class="d-flex justify-content-between">
                  <h5 class="card-title">{{ e.nombre }}</h5>
                  <span [class]="'badge align-self-start ' + badge(e.estado)">{{ e.estado }}</span>
                </div>
                <p class="card-text text-muted">{{ e.descripcion }}</p>
                <ul class="list-unstyled small mb-0">
                  <li><strong>Teatro:</strong> {{ e.teatro }} ({{ e.ciudad }})</li>
                  <li><strong>Inicio:</strong> {{ e.fecha_inicio | date: 'medium' }}</li>
                  <li><strong>Fin:</strong> {{ e.fecha_fin | date: 'medium' }}</li>
                  <li><strong>Precio:</strong> {{ e.precio_base | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</li>
                </ul>
              </div>
              <div class="card-footer bg-white">
                <button class="btn btn-primary btn-sm" (click)="reservar(e)">Reservar</button>
              </div>
            </div>
          </div>
        } @empty {
          <p class="text-muted">No hay eventos disponibles.</p>
        }
      </div>
    </div>
  `
})
export class ClienteEventosComponent implements OnInit {
  private eventos = inject(EventoService);
  private reservas = inject(ReservaService);
  private auth = inject(AuthService);

  lista = signal<Evento[]>([]);
  seleccionado = signal<Evento | null>(null);
  mensaje = signal('');
  error = signal('');
  entradas = 1;
  observaciones = '';
  badge = badgeClass;

  ngOnInit(): void {
    this.eventos.getAll().subscribe({
      next: (e) => this.lista.set(e.filter((x) => x.estado !== 'Finalizado' && x.estado !== 'Cancelado')),
      error: (err) => this.error.set(err?.error?.message ?? 'No se pudieron cargar los eventos')
    });
  }

  reservar(e: Evento): void {
    this.seleccionado.set(e);
    this.entradas = 1;
    this.observaciones = '';
    this.mensaje.set('');
    this.error.set('');
  }

  total(): number {
    const e = this.seleccionado();
    return e ? e.precio_base * this.entradas : 0;
  }

  confirmar(): void {
    const e = this.seleccionado();
    const u = this.auth.usuario();
    if (!e || !u) return;
    const data: Record<string, unknown> = {
      id_cliente: u.id_persona,
      codigo_evento: e.codigo_evento,
      numero_entradas: this.entradas,
      valor_total: this.total(),
      estado: 'Reservada'
    };
    if (this.observaciones) data['observaciones'] = this.observaciones;
    this.reservas.create(data).subscribe({
      next: () => {
        this.mensaje.set('Reserva realizada correctamente.');
        this.error.set('');
        this.seleccionado.set(null);
      },
      error: (err) => this.error.set(err?.error?.message ?? 'No se pudo crear la reserva')
    });
  }
}
