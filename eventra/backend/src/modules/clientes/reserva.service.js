const pool = require('../../config/db');
const httpError = require('../../utils/httpError');
const { makeService } = require('../../utils/crud');

const base = makeService(require('./reserva.model'));

module.exports = {
  ...base,

  // Si no se envía valor_total, se calcula: precio_base del evento x número de entradas
  async create(data) {
    const d = { ...data };
    if (d.valor_total === undefined || d.valor_total === null || d.valor_total === '') {
      const { rows } = await pool.query('SELECT precio_base FROM evento WHERE codigo_evento = $1', [d.codigo_evento]);
      if (!rows[0]) throw httpError(400, 'El evento indicado no existe');
      d.valor_total = rows[0].precio_base * Number(d.numero_entradas);
    }
    return base.create(d);
  }
};
