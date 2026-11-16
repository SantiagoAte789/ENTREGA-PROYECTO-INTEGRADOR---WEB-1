import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { Evento } from '../models/evento.model';

@Injectable({ providedIn: 'root' })
export class EventoService extends CrudService<Evento> {
  constructor(http: HttpClient) { super(http, 'eventos'); }
}
