import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudService } from '../crud.service';
import { Reserva } from '../models/reserva.model';

@Injectable({ providedIn: 'root' })
export class ReservaService extends CrudService<Reserva> {
  constructor(http: HttpClient) { super(http, 'reservas'); }
}
