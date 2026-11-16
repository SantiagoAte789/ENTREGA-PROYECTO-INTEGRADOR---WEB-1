import { ClienteService } from '../../core/services/persona.service';
import { EventoService } from '../../core/services/evento.service';
import { PersonaService } from '../../core/services/persona.service';
import { ReservaService } from '../../core/services/reserva.service';
import { CrudConfig } from '../../shared/crud.types';
import { PERSONA_COLUMNS, PERSONA_FIELDS } from '../../shared/persona.fields';

export const PERSONAS_CONFIG: CrudConfig = {
  title: 'Personas',
  singular: 'persona',
  pk: 'id_persona',
  service: PersonaService,
  columns: [...PERSONA_COLUMNS, { key: 'rol', label: 'Perfil' }],
  fields: PERSONA_FIELDS
};

export const CLIENTES_CONFIG: CrudConfig = {
  title: 'Clientes',
  singular: 'cliente',
  pk: 'id_persona',
  service: ClienteService,
  columns: [
    ...PERSONA_COLUMNS,
    { key: 'puntos', label: 'Puntos' },
    { key: 'visualizacion_publicidad', label: 'Ve publicidad', type: 'bool' }
  ],
  fields: [
    ...PERSONA_FIELDS,
    { key: 'puntos', label: 'Puntos', type: 'number' },
    { key: 'visualizacion_publicidad', label: 'Visualización de publicidad', type: 'checkbox' }
  ]
};

export const RESERVAS_CONFIG: CrudConfig = {
  title: 'Reservas',
  singular: 'reserva',
  pk: 'id_reserva',
  service: ReservaService,
  columns: [
    { key: 'id_reserva', label: 'ID' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'evento', label: 'Evento' },
    { key: 'fecha_hora', label: 'Fecha y hora', type: 'date' },
    { key: 'numero_entradas', label: 'Entradas' },
    { key: 'valor_total', label: 'Valor total', type: 'money' },
    { key: 'estado', label: 'Estado', type: 'badge' },
    { key: 'causa_cancelacion', label: 'Causa cancelación' }
  ],
  fields: [
    { key: 'id_cliente', label: 'Cliente', type: 'select', required: true,
      optionsFrom: { service: ClienteService, value: 'id_persona', label: 'nombre_completo' } },
    { key: 'codigo_evento', label: 'Evento', type: 'select', required: true,
      optionsFrom: { service: EventoService, value: 'codigo_evento', label: 'nombre' } },
    { key: 'numero_entradas', label: 'Número de entradas', type: 'number', required: true },
    { key: 'valor_total', label: 'Valor total (vacío = precio x entradas)', type: 'number' },
    { key: 'fecha_hora', label: 'Fecha y hora (vacío = ahora)', type: 'datetime' },
    { key: 'estado', label: 'Estado', type: 'select',
      options: [
        { value: 'Reservada', label: 'Reservada' },
        { value: 'Confirmada', label: 'Confirmada' },
        { value: 'Cancelada', label: 'Cancelada' }
      ] },
    { key: 'causa_cancelacion', label: 'Causa de cancelación', type: 'textarea' },
    { key: 'observaciones', label: 'Observaciones', type: 'textarea' }
  ]
};
