export type EstadoReserva = 'Reservada' | 'Confirmada' | 'Cancelada';

export interface Reserva {
  id_reserva: number;
  id_cliente: number;
  cliente?: string;
  codigo_evento: number;
  evento?: string;
  fecha_hora: string;
  valor_total: number;
  numero_entradas: number;
  observaciones: string | null;
  estado: EstadoReserva;
  causa_cancelacion: string | null;
}
