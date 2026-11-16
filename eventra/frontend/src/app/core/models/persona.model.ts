export type Rol = 'cliente' | 'agente' | 'administrador';

export interface Usuario { id_persona: number; nombre_completo: string; correo: string; rol: Rol; }

export interface Persona {
  id_persona: number;
  identificacion: string;
  nombre_completo: string;
  correo: string;
  direccion: string;
  id_ciudad: number;
  ciudad?: string;
  telefonos: string[];
  rol?: Rol | null;
}

export interface Cliente extends Persona { puntos: number; visualizacion_publicidad: boolean; }
export interface Agente extends Persona { comision: number; experiencia: number; }
export interface Administrador extends Persona { salario: number; horario: string; }
