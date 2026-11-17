const pool = require('../../config/db');
const q = require('./reportes.model');

const run = async (sql, params = []) => (await pool.query(sql, params)).rows;

module.exports = {
  general: async () => (await run(q.general))[0],
  promedioIngresosAgente: () => run(q.promedioIngresosAgente),
  promedioIngresosCliente: () => run(q.promedioIngresosCliente),
  ingresosMensuales: (anio) => run(q.ingresosMensuales, [anio]),
  reservasEventoMes: (anio) => run(q.reservasEventoMes, [anio]),
  eventosAgenteCiudad: () => run(q.eventosAgenteCiudad),
  eventosUbicacion: () => run(q.eventosUbicacion),
  historialReservasCliente: () => run(q.historialReservasCliente),
  reservasCanceladas: () => run(q.reservasCanceladas),
  eventosCancelados: () => run(q.eventosCancelados)
};
