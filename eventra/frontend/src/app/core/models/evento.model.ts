export type EstadoEvento = 'Programado' | 'En Boletería' | 'En Vivo' | 'Finalizado' | 'Cancelado';

export interface Evento {
  codigo_evento: number;
  nombre: string;
  descripcion: string | null;
  teatro: string;
  id_ciudad: number;
  ciudad?: string;
  fecha_inicio: string;
  fecha_fin: string;
  capacidad: number;
  precio_base: number;
  observaciones: string | null;
  estado: EstadoEvento;
  causa_cancelacion: string | null;
  id_agente: number;
  agente?: string;
}
