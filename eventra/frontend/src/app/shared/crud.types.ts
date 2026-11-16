import { Type } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { CrudService } from '../core/crud.service';

export interface Option { value: unknown; label: string; }

export interface CrudField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'datetime' | 'select' | 'phones' | 'checkbox';
  required?: boolean;
  requiredOnCreate?: boolean;
  hideOnEdit?: boolean;
  options?: Option[];
  optionsFrom?: { service: Type<CrudService<any>>; value: string; label: string };
}

export interface CrudColumn {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'money' | 'bool' | 'list' | 'badge';
}

export interface CrudConfig {
  title: string;
  singular: string;
  pk: string;
  service: Type<CrudService<any>>;
  columns: CrudColumn[];
  fields: CrudField[];
  canCreate?: boolean;
  canEdit?: boolean;
  canDelete?: boolean;
  /** Valores fijos que se agregan al crear (ej. el agente que registra el evento). */
  payloadDefaults?: (auth: AuthService) => Record<string, unknown>;
}
