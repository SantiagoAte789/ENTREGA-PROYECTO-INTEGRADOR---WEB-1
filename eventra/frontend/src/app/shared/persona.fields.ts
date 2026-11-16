import { CiudadService } from '../core/services/localizacion.service';
import { CrudColumn, CrudField } from './crud.types';

/** Campos comunes de Persona, reutilizados por Personas, Clientes, Agentes y Administradores. */
export const PERSONA_FIELDS: CrudField[] = [
  { key: 'identificacion', label: 'Cédula o pasaporte', type: 'text', required: true },
  { key: 'nombre_completo', label: 'Nombre completo', type: 'text', required: true },
  { key: 'correo', label: 'Correo', type: 'email', required: true },
  { key: 'password', label: 'Contraseña', type: 'password', requiredOnCreate: true },
  { key: 'direccion', label: 'Dirección', type: 'text', required: true },
  { key: 'id_ciudad', label: 'Ciudad', type: 'select', required: true,
    optionsFrom: { service: CiudadService, value: 'id_ciudad', label: 'nombre' } },
  { key: 'telefonos', label: 'Teléfonos (separados por coma)', type: 'phones' }
];

export const PERSONA_COLUMNS: CrudColumn[] = [
  { key: 'id_persona', label: 'ID' },
  { key: 'identificacion', label: 'Identificación' },
  { key: 'nombre_completo', label: 'Nombre' },
  { key: 'correo', label: 'Correo' },
  { key: 'ciudad', label: 'Ciudad' },
  { key: 'telefonos', label: 'Teléfonos', type: 'list' }
];
