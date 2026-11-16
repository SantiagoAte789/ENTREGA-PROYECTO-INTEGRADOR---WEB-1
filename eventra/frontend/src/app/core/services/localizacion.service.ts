import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { Ciudad, Departamento, Pais } from '../models/localizacion.model';

@Injectable({ providedIn: 'root' })
export class PaisService extends CrudService<Pais> {
  constructor(http: HttpClient) { super(http, 'paises'); }
}

@Injectable({ providedIn: 'root' })
export class DepartamentoService extends CrudService<Departamento> {
  constructor(http: HttpClient) { super(http, 'departamentos'); }
}

@Injectable({ providedIn: 'root' })
export class CiudadService extends CrudService<Ciudad> {
  constructor(http: HttpClient) { super(http, 'ciudades'); }
}
