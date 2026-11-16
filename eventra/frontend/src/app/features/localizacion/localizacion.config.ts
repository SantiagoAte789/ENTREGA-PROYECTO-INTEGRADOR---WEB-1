import { CrudConfig } from '../../shared/crud.types';
import { CiudadService, DepartamentoService, PaisService } from '../../core/services/localizacion.service';

export const PAISES_CONFIG: CrudConfig = {
  title: 'Países',
  singular: 'país',
  pk: 'id_pais',
  service: PaisService,
  columns: [
    { key: 'id_pais', label: 'ID' },
    { key: 'nombre', label: 'Nombre' }
  ],
  fields: [{ key: 'nombre', label: 'Nombre', type: 'text', required: true }]
};

export const DEPARTAMENTOS_CONFIG: CrudConfig = {
  title: 'Departamentos',
  singular: 'departamento',
  pk: 'id_departamento',
  service: DepartamentoService,
  columns: [
    { key: 'id_departamento', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'pais', label: 'País' }
  ],
  fields: [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'id_pais', label: 'País', type: 'select', required: true,
      optionsFrom: { service: PaisService, value: 'id_pais', label: 'nombre' } }
  ]
};

export const CIUDADES_CONFIG: CrudConfig = {
  title: 'Ciudades',
  singular: 'ciudad',
  pk: 'id_ciudad',
  service: CiudadService,
  columns: [
    { key: 'id_ciudad', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'departamento', label: 'Departamento' },
    { key: 'pais', label: 'País' }
  ],
  fields: [
    { key: 'nombre', label: 'Nombre', type: 'text', required: true },
    { key: 'id_departamento', label: 'Departamento', type: 'select', required: true,
      optionsFrom: { service: DepartamentoService, value: 'id_departamento', label: 'nombre' } }
  ]
};
