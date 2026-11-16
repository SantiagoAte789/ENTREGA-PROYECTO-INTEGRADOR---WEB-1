import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

/** Servicio base con las 5 operaciones CRUD consumiendo la API REST. */
export class CrudService<T> {
  constructor(protected http: HttpClient, protected resource: string) {}

  private get url(): string {
    return `${environment.apiUrl}/${this.resource}`;
  }

  getAll(params: Record<string, string | number> = {}) {
    return this.http.get<T[]>(this.url, { params });
  }

  getById(id: number) {
    return this.http.get<T>(`${this.url}/${id}`);
  }

  create(data: Partial<T> | Record<string, unknown>) {
    return this.http.post<T>(this.url, data);
  }

  update(id: number, data: Partial<T> | Record<string, unknown>) {
    return this.http.put<T>(`${this.url}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete<{ message: string }>(`${this.url}/${id}`);
  }
}
