import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Reserva } from '../../core/models/reserva.model';
import { ReservaService } from '../../core/services/reserva.service';
import { badgeClass } from '../../shared/utils';

@Component({
  selector: 'app-agente-reservas',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    <div class="container-fluid py-4">
      <h3 class="mb-3">Administración de reservas</h3>
      @if (mensaje()) { <div class="alert alert-success">{{ mensaje() }}</div> }
      @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }
      <div class="table-responsive">
        <table class="table table-striped align-middle bg-white">
          <thead class="table-dark">
            <tr>
              <th>ID</th><th>Cliente</th><th>Evento</th><th>Fecha</th><th>Entradas</th>
              <th>Valor total</th><th>Estado</th><th>Causa de cancelación</th>
            </tr>
          </thead>
          <tbody>
            @for (r of reservas(); track r.id_reserva) {
              <tr>
                <td>{{ r.id_reserva }}</td>
                <td>{{ r.cliente }}</td>
                <td>{{ r.evento }}</td>
                <td>{{ r.fecha_hora | date: 'medium' }}</td>
                <td>{{ r.numero_entradas }}</td>
                <td>{{ r.valor_total | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                <td>
                  <select class="form-select form-select-sm" [value]="r.estado"
                          (change)="cambiarEstado(r, $any($event.target).value)">
                    @for (e of estados; track e) { <option [value]="e" [selected]="e === r.estado">{{ e }}</option> }
                  </select>
                  <span [class]="'badge mt-1 ' + badge(r.estado)">{{ r.estado }}</span>
                </td>
                <td>{{ r.causa_cancelacion }}</td>
              </tr>
            } @empty {
              <tr><td colspan="8" class="text-center text-muted">No hay reservas</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class AgenteReservasComponent implements OnInit {
  private service = inject(ReservaService);

  reservas = signal<Reserva[]>([]);
  mensaje = signal('');
  error = signal('');
  estados = ['Reservada', 'Confirmada', 'Cancelada'];
  badge = badgeClass;

  ngOnInit(): void {
    this.cargar();
  }

  private cargar(): void {
    this.service.getAll().subscribe({
      next: (r) => this.reservas.set(r),
      error: (e) => this.error.set(e?.error?.message ?? 'No se pudieron cargar las reservas')
    });
  }

  cambiarEstado(r: Reserva, estado: string): void {
    if (estado === r.estado) return;
    let causa: string | null = null;
    if (estado === 'Cancelada') {
      causa = prompt('Indique la causa de la cancelación:');
      if (!causa) {
        this.cargar();
        return;
      }
    }
    this.service.update(r.id_reserva, { estado, causa_cancelacion: causa }).subscribe({
      next: () => {
        this.mensaje.set(`Reserva ${r.id_reserva} actualizada a ${estado}`);
        this.error.set('');
        this.cargar();
      },
      error: (e) => {
        this.error.set(e?.error?.message ?? 'No se pudo actualizar la reserva');
        this.cargar();
      }
    });
  }
}
