import { AgenteService } from '../../core/services/persona.service';
import { CiudadService } from '../../core/services/localizacion.service';
import { EventoService } from '../../core/services/evento.service';
import { CrudConfig, CrudField } from '../../shared/crud.types';
import { PERSONA_COLUMNS, PERSONA_FIELDS } from '../../shared/persona.fields';

export const AGENTES_CONFIG: CrudConfig = {
  title: 'Agentes',
  singular: 'agente',
  pk: 'id_persona',
  service: AgenteService,
  columns: [
    ...PERSONA_COLUMNS,
    { key: 'comision', label: 'Comisión (%)' },
    { key: 'experiencia', label: 'Experiencia (años)' }
  ],
  fields: [
    ...PERSONA_FIELDS,
    { key: 'comision', label: 'Comisión (%)', type: 'number' },
    { key: 'experiencia', label: 'Experiencia (años)', type: 'number' }
  ]
};

const EVENTO_COLUMNS = [
  { key: 'codigo_evento', label: 'Código' },
  { key: 'nombre', label: 'Nombre' },
  { key: 'teatro', label: 'Teatro' },
  { key: 'ciudad', label: 'Ciudad' },
  { key: 'fecha_inicio', label: 'Inicio', type: 'date' as const },
  { key: 'fecha_fin', label: 'Fin', type: 'date' as const },
  { key: 'capacidad', label: 'Capacidad' },
  { key: 'precio_base', label: 'Precio base', type: 'money' as const },
  { key: 'estado', label: 'Estado', type: 'badge' as const },
  { key: 'agente', label: 'Agente' }
];

const EVENTO_FIELDS: CrudField[] = [
  { key: 'nombre', label: 'Nombre', type: 'text', required: true },
  { key: 'teatro', label: 'Teatro', type: 'text', required: true },
  { key: 'id_ciudad', label: 'Ciudad', type: 'select', required: true,
    optionsFrom: { service: CiudadService, value: 'id_ciudad', label: 'nombre' } },
  { key: 'fecha_inicio', label: 'Fecha y hora de inicio', type: 'datetime', required: true },
  { key: 'fecha_fin', label: 'Fecha y hora de fin', type: 'datetime', required: true },
  { key: 'capacidad', label: 'Capacidad', type: 'number', required: true },
  { key: 'precio_base', label: 'Precio base', type: 'number', required: true },
  { key: 'estado', label: 'Estado', type: 'select', required: true,
    options: [
      { value: 'Programado', label: 'Programado' },
      { value: 'En Boletería', label: 'En Boletería' },
      { value: 'En Vivo', label: 'En Vivo' },
      { value: 'Finalizado', label: 'Finalizado' },
      { value: 'Cancelado', label: 'Cancelado' }
    ] },
  { key: 'descripcion', label: 'Descripción', type: 'textarea' },
  { key: 'observaciones', label: 'Observaciones', type: 'textarea' },
  { key: 'causa_cancelacion', label: 'Causa de cancelación', type: 'textarea' }
];

/** Administrador: CRUD completo de eventos, eligiendo el agente. */
export const EVENTOS_ADMIN_CONFIG: CrudConfig = {
  title: 'Eventos',
  singular: 'evento',
  pk: 'codigo_evento',
  service: EventoService,
  columns: EVENTO_COLUMNS,
  fields: [
    ...EVENTO_FIELDS,
    { key: 'id_agente', label: 'Agente', type: 'select', required: true,
      optionsFrom: { service: AgenteService, value: 'id_persona', label: 'nombre_completo' } }
  ]
};

/** Agente: registra eventos (queda como agente creador) y visualiza todos los eventos. */
export const EVENTOS_AGENTE_CONFIG: CrudConfig = {
  title: 'Eventos',
  singular: 'evento',
  pk: 'codigo_evento',
  service: EventoService,
  columns: EVENTO_COLUMNS,
  fields: EVENTO_FIELDS,
  canEdit: false,
  canDelete: false,
  payloadDefaults: (auth) => ({ id_agente: auth.usuario()?.id_persona })
};
