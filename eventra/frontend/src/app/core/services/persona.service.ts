import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { Administrador, Agente, Cliente, Persona } from '../models/persona.model';

@Injectable({ providedIn: 'root' })
export class PersonaService extends CrudService<Persona> {
  constructor(http: HttpClient) { super(http, 'personas'); }
}

@Injectable({ providedIn: 'root' })
export class ClienteService extends CrudService<Cliente> {
  constructor(http: HttpClient) { super(http, 'clientes'); }
}

@Injectable({ providedIn: 'root' })
export class AgenteService extends CrudService<Agente> {
  constructor(http: HttpClient) { super(http, 'agentes'); }
}

@Injectable({ providedIn: 'root' })
export class AdministradorService extends CrudService<Administrador> {
  constructor(http: HttpClient) { super(http, 'administradores'); }
}
