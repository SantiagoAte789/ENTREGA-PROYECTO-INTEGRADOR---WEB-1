import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Reserva } from '../../core/models/reserva.model';
import { ReservaService } from '../../core/services/reserva.service';
import { badgeClass } from '../../shared/utils';

@Component({
  selector: 'app-cliente-reservas',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    <div class="container py-4">
      <h3 class="mb-3">Mis reservas</h3>
      @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }
      <div class="table-responsive">
        <table class="table table-striped align-middle bg-white">
          <thead class="table-dark">
            <tr>
              <th>ID</th><th>Evento</th><th>Fecha de reserva</th><th>Entradas</th>
              <th>Valor total</th><th>Estado</th><th>Causa de cancelación</th>
            </tr>
          </thead>
          <tbody>
            @for (r of reservas(); track r.id_reserva) {
              <tr>
                <td>{{ r.id_reserva }}</td>
                <td>{{ r.evento }}</td>
                <td>{{ r.fecha_hora | date: 'medium' }}</td>
                <td>{{ r.numero_entradas }}</td>
                <td>{{ r.valor_total | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                <td><span [class]="'badge ' + badge(r.estado)">{{ r.estado }}</span></td>
                <td>{{ r.causa_cancelacion }}</td>
              </tr>
            } @empty {
              <tr><td colspan="7" class="text-center text-muted">Aún no tienes reservas</td></tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ClienteReservasComponent implements OnInit {
  private service = inject(ReservaService);
  private auth = inject(AuthService);

  reservas = signal<Reserva[]>([]);
  error = signal('');
  badge = badgeClass;

  ngOnInit(): void {
    const u = this.auth.usuario();
    if (!u) return;
    this.service.getAll({ id_cliente: u.id_persona }).subscribe({
      next: (r) => this.reservas.set(r),
      error: (e) => this.error.set(e?.error?.message ?? 'No se pudieron cargar las reservas')
    });
  }
}
