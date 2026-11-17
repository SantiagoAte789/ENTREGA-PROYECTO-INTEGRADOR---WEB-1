import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { badgeClass } from '../../shared/utils';
import { ReportesService } from './reportes.service';

const ANIO = 2026;
const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  template: `
    <div class="container-fluid py-4">
      <h3 class="mb-3">Dashboard de reportes</h3>
      @if (error()) { <div class="alert alert-danger">{{ error() }}</div> }

      @if (d(); as d) {
        <!-- Reporte general -->
        <div class="row g-3 mb-4">
          @for (c of tarjetas(d.general); track c.label) {
            <div class="col-6 col-md">
              <div class="card text-center shadow-sm"><div class="card-body">
                <div class="fs-2 fw-bold">{{ c.valor }}</div>
                <div class="text-muted">{{ c.label }}</div>
              </div></div>
            </div>
          }
        </div>

        <div class="row g-4">
          <div class="col-lg-6">
            <h5>Ingresos totales por mes ({{ anio }})</h5>
            <table class="table table-sm bg-white">
              <thead class="table-dark"><tr><th>Mes</th><th>Ingresos</th><th style="width:45%"></th></tr></thead>
              <tbody>
                @for (m of d.ingresosMensuales; track m.mes) {
                  <tr>
                    <td>{{ meses[m.mes - 1] }}</td>
                    <td>{{ m.ingresos | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                    <td>
                      <div class="progress" style="height: 14px">
                        <div class="progress-bar" [style.width.%]="porcentaje(m.ingresos, d.ingresosMensuales)"></div>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="col-lg-6">
            <h5>Reservas por evento y por mes ({{ anio }})</h5>
            <table class="table table-sm bg-white">
              <thead class="table-dark"><tr><th>Evento</th><th>Mes</th><th>Reservas</th></tr></thead>
              <tbody>
                @for (r of d.reservasEventoMes; track $index) {
                  <tr><td>{{ r.evento }}</td><td>{{ meses[r.mes - 1] }}</td><td>{{ r.reservas }}</td></tr>
                } @empty { <tr><td colspan="3" class="text-muted">Sin datos</td></tr> }
              </tbody>
            </table>
          </div>

          <div class="col-lg-6">
            <h5>Promedio de ingresos por agente</h5>
            <table class="table table-sm bg-white">
              <thead class="table-dark"><tr><th>Agente</th><th>Reservas confirmadas</th><th>Ingresos totales</th><th>Promedio</th></tr></thead>
              <tbody>
                @for (a of d.promedioAgente; track a.id_agente) {
                  <tr>
                    <td>{{ a.agente }}</td><td>{{ a.reservas_confirmadas }}</td>
                    <td>{{ a.ingresos_totales | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                    <td>{{ a.promedio_ingresos | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="col-lg-6">
            <h5>Promedio de ingresos por cliente</h5>
            <table class="table table-sm bg-white">
              <thead class="table-dark"><tr><th>Cliente</th><th>Reservas confirmadas</th><th>Ingresos totales</th><th>Promedio</th></tr></thead>
              <tbody>
                @for (c of d.promedioCliente; track c.id_cliente) {
                  <tr>
                    <td>{{ c.cliente }}</td><td>{{ c.reservas_confirmadas }}</td>
                    <td>{{ c.ingresos_totales | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                    <td>{{ c.promedio_ingresos | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="col-lg-6">
            <h5>Eventos creados por agente y por ciudad</h5>
            <table class="table table-sm bg-white">
              <thead class="table-dark"><tr><th>Agente</th><th>Ciudad</th><th>Eventos</th></tr></thead>
              <tbody>
                @for (e of d.eventosAgenteCiudad; track $index) {
                  <tr><td>{{ e.agente }}</td><td>{{ e.ciudad }}</td><td>{{ e.eventos }}</td></tr>
                }
              </tbody>
            </table>
          </div>

          <div class="col-lg-6">
            <h5>Eventos por país, departamento y ciudad</h5>
            <table class="table table-sm bg-white">
              <thead class="table-dark"><tr><th>País</th><th>Departamento</th><th>Ciudad</th><th>Evento</th><th>Estado</th></tr></thead>
              <tbody>
                @for (e of d.eventosUbicacion; track $index) {
                  <tr>
                    <td>{{ e.pais }}</td><td>{{ e.departamento }}</td><td>{{ e.ciudad }}</td><td>{{ e.evento }}</td>
                    <td><span [class]="'badge ' + badge(e.estado)">{{ e.estado }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="col-12">
            <h5>Historial de reservas por cliente</h5>
            <table class="table table-sm bg-white">
              <thead class="table-dark"><tr><th>Cliente</th><th>Reserva</th><th>Evento</th><th>Fecha</th><th>Entradas</th><th>Valor</th><th>Estado</th></tr></thead>
              <tbody>
                @for (h of d.historial; track h.id_reserva) {
                  <tr>
                    <td>{{ h.cliente }}</td><td>{{ h.id_reserva }}</td><td>{{ h.evento }}</td>
                    <td>{{ h.fecha_hora | date: 'medium' }}</td><td>{{ h.numero_entradas }}</td>
                    <td>{{ h.valor_total | currency: 'COP' : 'symbol-narrow' : '1.0-0' }}</td>
                    <td><span [class]="'badge ' + badge(h.estado)">{{ h.estado }}</span></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>

          <div class="col-lg-6">
            <h5>Reservas canceladas y su causa</h5>
            <table class="table table-sm bg-white">
              <thead class="table-dark"><tr><th>Reserva</th><th>Cliente</th><th>Evento</th><th>Causa</th></tr></thead>
              <tbody>
                @for (r of d.reservasCanceladas; track r.id_reserva) {
                  <tr><td>{{ r.id_reserva }}</td><td>{{ r.cliente }}</td><td>{{ r.evento }}</td><td>{{ r.causa }}</td></tr>
                } @empty { <tr><td colspan="4" class="text-muted">Sin datos</td></tr> }
              </tbody>
            </table>
          </div>

          <div class="col-lg-6">
            <h5>Eventos cancelados y su causa</h5>
            <table class="table table-sm bg-white">
              <thead class="table-dark"><tr><th>Evento</th><th>Ciudad</th><th>Fecha</th><th>Causa</th></tr></thead>
              <tbody>
                @for (e of d.eventosCancelados; track e.codigo_evento) {
                  <tr><td>{{ e.evento }}</td><td>{{ e.ciudad }}</td><td>{{ e.fecha_inicio | date: 'medium' }}</td><td>{{ e.causa }}</td></tr>
                } @empty { <tr><td colspan="4" class="text-muted">Sin datos</td></tr> }
              </tbody>
            </table>
          </div>
        </div>
      } @else if (!error()) {
        <p class="text-muted">Cargando reportes...</p>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private reportes = inject(ReportesService);

  anio = ANIO;
  meses = MESES;
  d = signal<any | null>(null);
  error = signal('');
  badge = badgeClass;

  ngOnInit(): void {
    forkJoin({
      general: this.reportes.general(),
      promedioAgente: this.reportes.promedioIngresosAgente(),
      promedioCliente: this.reportes.promedioIngresosCliente(),
      ingresosMensuales: this.reportes.ingresosMensuales(ANIO),
      reservasEventoMes: this.reportes.reservasEventoMes(ANIO),
      eventosAgenteCiudad: this.reportes.eventosAgenteCiudad(),
      eventosUbicacion: this.reportes.eventosUbicacion(),
      historial: this.reportes.historialReservasCliente(),
      reservasCanceladas: this.reportes.reservasCanceladas(),
      eventosCancelados: this.reportes.eventosCancelados()
    }).subscribe({
      next: (r) => this.d.set(r),
      error: (e) => this.error.set(e?.error?.message ?? 'No se pudieron cargar los reportes')
    });
  }

  tarjetas(g: Record<string, number>): { label: string; valor: number }[] {
    return [
      { label: 'Clientes', valor: g['clientes'] },
      { label: 'Agentes', valor: g['agentes'] },
      { label: 'Administradores', valor: g['administradores'] },
      { label: 'Reservas', valor: g['reservas'] },
      { label: 'Eventos', valor: g['eventos'] }
    ];
  }

  porcentaje(valor: number, lista: { ingresos: number }[]): number {
    const max = Math.max(...lista.map((x) => x.ingresos), 0);
    return max ? Math.round((valor / max) * 100) : 0;
  }
}
