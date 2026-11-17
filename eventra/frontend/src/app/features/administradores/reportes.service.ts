import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportesService {
  private http = inject(HttpClient);
  private base = `${environment.apiUrl}/reportes`;

  private get<T = any[]>(path: string, anio?: number) {
    return this.http.get<T>(`${this.base}/${path}`, { params: anio ? { anio } : {} });
  }

  general() { return this.get<Record<string, number>>('general'); }
  promedioIngresosAgente() { return this.get('promedio-ingresos-agente'); }
  promedioIngresosCliente() { return this.get('promedio-ingresos-cliente'); }
  ingresosMensuales(anio: number) { return this.get('ingresos-mensuales', anio); }
  reservasEventoMes(anio: number) { return this.get('reservas-evento-mes', anio); }
  eventosAgenteCiudad() { return this.get('eventos-agente-ciudad'); }
  eventosUbicacion() { return this.get('eventos-ubicacion'); }
  historialReservasCliente() { return this.get('historial-reservas-cliente'); }
  reservasCanceladas() { return this.get('reservas-canceladas'); }
  eventosCancelados() { return this.get('eventos-cancelados'); }
}
