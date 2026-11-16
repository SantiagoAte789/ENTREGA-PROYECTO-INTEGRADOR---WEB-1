import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Injector, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { CrudService } from '../../core/crud.service';
import { CrudConfig, CrudField, Option } from '../crud.types';
import { badgeClass } from '../utils';

/**
 * Pantalla genérica de CRUD: consulta, registro, actualización y eliminación.
 * Se configura desde la ruta con data: { config }.
 */
@Component({
  selector: 'app-crud-page',
  standalone: true,
  imports: [FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './crud-page.component.html'
})
export class CrudPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private injector = inject(Injector);
  private auth = inject(AuthService);

  config!: CrudConfig;
  private service!: CrudService<any>;

  rows = signal<any[]>([]);
  options = signal<Record<string, Option[]>>({});
  showForm = signal(false);
  message = signal('');
  error = signal('');

  model: Record<string, any> = {};
  editingId: number | null = null;
  badge = badgeClass;

  ngOnInit(): void {
    this.config = this.route.snapshot.data['config'] as CrudConfig;
    this.service = this.injector.get(this.config.service);
    this.load();
    this.loadOptions();
  }

  fields(): CrudField[] {
    return this.config.fields.filter((f) => !(this.editingId !== null && f.hideOnEdit));
  }

  optionsFor(f: CrudField): Option[] {
    return f.options ?? this.options()[f.key] ?? [];
  }

  inputType(f: CrudField): string {
    return f.type === 'phones' ? 'text' : f.type;
  }

  isRequired(f: CrudField): boolean {
    return !!f.required || (!!f.requiredOnCreate && this.editingId === null);
  }

  private load(): void {
    this.service.getAll().subscribe({
      next: (data) => this.rows.set(data),
      error: (e) => this.error.set(this.msg(e))
    });
  }

  private loadOptions(): void {
    for (const f of this.config.fields) {
      const from = f.optionsFrom;
      if (!from) continue;
      this.injector.get(from.service).getAll().subscribe({
        next: (list: any[]) =>
          this.options.update((o) => ({
            ...o,
            [f.key]: list.map((i) => ({ value: i[from.value], label: i[from.label] }))
          })),
        error: (e) => this.error.set(this.msg(e))
      });
    }
  }

  openNew(): void {
    this.editingId = null;
    this.model = {};
    for (const f of this.config.fields) if (f.type === 'checkbox') this.model[f.key] = false;
    this.message.set('');
    this.error.set('');
    this.showForm.set(true);
  }

  openEdit(row: any): void {
    this.editingId = row[this.config.pk];
    this.model = { ...row };
    for (const f of this.config.fields) {
      if (f.type === 'datetime' && row[f.key]) this.model[f.key] = this.toLocalInput(row[f.key]);
      if (f.type === 'phones') this.model[f.key] = Array.isArray(row[f.key]) ? row[f.key].join(', ') : '';
      if (f.type === 'password') this.model[f.key] = '';
    }
    this.message.set('');
    this.error.set('');
    this.showForm.set(true);
  }

  cancel(): void {
    this.showForm.set(false);
  }

  save(): void {
    const editing = this.editingId !== null;
    const payload: Record<string, unknown> = {};

    for (const f of this.fields()) {
      const v = this.model[f.key];
      const empty = v === undefined || v === null || v === '';
      if (f.type === 'checkbox') {
        payload[f.key] = !!v;
        continue;
      }
      if (empty) {
        // En edición, un campo opcional vacío se limpia; en creación se omite (aplica el valor por defecto)
        if (editing && !this.isRequired(f) && f.type !== 'password') payload[f.key] = null;
        continue;
      }
      if (f.type === 'number') payload[f.key] = Number(v);
      else if (f.type === 'datetime') payload[f.key] = new Date(v).toISOString();
      else if (f.type === 'phones') payload[f.key] = String(v).split(',').map((t) => t.trim()).filter(Boolean);
      else payload[f.key] = v;
    }

    if (!editing && this.config.payloadDefaults) Object.assign(payload, this.config.payloadDefaults(this.auth));

    const request = editing
      ? this.service.update(this.editingId as number, payload)
      : this.service.create(payload);

    request.subscribe({
      next: () => {
        this.message.set(editing ? 'Registro actualizado correctamente' : 'Registro creado correctamente');
        this.error.set('');
        this.showForm.set(false);
        this.load();
      },
      error: (e) => this.error.set(this.msg(e))
    });
  }

  remove(row: any): void {
    if (!confirm('¿Seguro que desea eliminar este registro?')) return;
    this.service.delete(row[this.config.pk]).subscribe({
      next: (r) => {
        this.message.set(r.message);
        this.error.set('');
        this.load();
      },
      error: (e) => this.error.set(this.msg(e))
    });
  }

  private toLocalInput(value: string): string {
    const d = new Date(value);
    const p = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }

  private msg(e: any): string {
    return e?.error?.message ?? 'No se pudo completar la operación';
  }
}
