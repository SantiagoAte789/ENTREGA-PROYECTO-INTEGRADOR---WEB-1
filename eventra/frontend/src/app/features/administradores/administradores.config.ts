import { AdministradorService } from '../../core/services/persona.service';
import { CrudConfig } from '../../shared/crud.types';
import { PERSONA_COLUMNS, PERSONA_FIELDS } from '../../shared/persona.fields';

export const ADMINISTRADORES_CONFIG: CrudConfig = {
  title: 'Administradores',
  singular: 'administrador',
  pk: 'id_persona',
  service: AdministradorService,
  columns: [
    ...PERSONA_COLUMNS,
    { key: 'salario', label: 'Salario', type: 'money' },
    { key: 'horario', label: 'Horario' }
  ],
  fields: [
    ...PERSONA_FIELDS,
    { key: 'salario', label: 'Salario', type: 'number', required: true },
    { key: 'horario', label: 'Horario', type: 'text', required: true }
  ]
};
