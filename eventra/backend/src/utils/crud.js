const pool = require('../config/db');
const httpError = require('./httpError');

const clean = (v) => (v === '' ? null : v);

/**
 * Service genérico con las 5 operaciones CRUD sobre una tabla.
 * model = { table, pk, fields, select?, filters? }
 */
function makeService(model) {
  const base = model.select || `SELECT * FROM ${model.table}`;

  const getById = async (id) => {
    const { rows } = await pool.query(`SELECT * FROM (${base}) x WHERE x.${model.pk} = $1`, [id]);
    return rows[0] || null;
  };

  return {
    getById,

    async getAll(filters = {}) {
      const keys = (model.filters || []).filter((k) => filters[k] !== undefined && filters[k] !== '');
      const where = keys.length ? 'WHERE ' + keys.map((k, i) => `x.${k} = $${i + 1}`).join(' AND ') : '';
      const { rows } = await pool.query(
        `SELECT * FROM (${base}) x ${where} ORDER BY x.${model.pk}`,
        keys.map((k) => filters[k])
      );
      return rows;
    },

    async create(data) {
      const cols = model.fields.filter((f) => data[f] !== undefined && data[f] !== '');
      if (!cols.length) throw httpError(400, 'No se enviaron datos');
      const { rows } = await pool.query(
        `INSERT INTO ${model.table} (${cols.join(', ')}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) RETURNING ${model.pk}`,
        cols.map((c) => data[c])
      );
      return getById(rows[0][model.pk]);
    },

    async update(id, data) {
      const cols = model.fields.filter((f) => data[f] !== undefined);
      if (!cols.length) throw httpError(400, 'No se enviaron datos');
      const { rowCount } = await pool.query(
        `UPDATE ${model.table} SET ${cols.map((c, i) => `${c} = $${i + 1}`).join(', ')} WHERE ${model.pk} = $${cols.length + 1}`,
        [...cols.map((c) => clean(data[c])), id]
      );
      return rowCount ? getById(id) : null;
    },

    async remove(id) {
      const { rowCount } = await pool.query(`DELETE FROM ${model.table} WHERE ${model.pk} = $1`, [id]);
      return rowCount > 0;
    }
  };
}

/** Controller genérico: recibe la petición HTTP y arma la respuesta. */
function makeController(service, label) {
  const handler = (fn) => async (req, res, next) => {
    try {
      await fn(req, res);
    } catch (e) {
      next(e);
    }
  };
  const notFound = (res) => res.status(404).json({ message: `Registro de ${label} no encontrado` });

  return {
    getAll: handler(async (req, res) => res.json(await service.getAll(req.query))),
    getById: handler(async (req, res) => {
      const row = await service.getById(req.params.id);
      return row ? res.json(row) : notFound(res);
    }),
    create: handler(async (req, res) => res.status(201).json(await service.create(req.body))),
    update: handler(async (req, res) => {
      const row = await service.update(req.params.id, req.body);
      return row ? res.json(row) : notFound(res);
    }),
    remove: handler(async (req, res) => {
      const ok = await service.remove(req.params.id);
      return ok ? res.json({ message: `Registro de ${label} eliminado correctamente` }) : notFound(res);
    })
  };
}

module.exports = { makeService, makeController };
