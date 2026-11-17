const service = require('./reportes.service');

// Año de los reportes mensuales (por defecto 2026)
const handler = (fn) => async (req, res, next) => {
  try {
    res.json(await fn(Number(req.query.anio) || 2026));
  } catch (e) {
    next(e);
  }
};

module.exports = {
  general: handler(() => service.general()),
  promedioIngresosAgente: handler(() => service.promedioIngresosAgente()),
  promedioIngresosCliente: handler(() => service.promedioIngresosCliente()),
  ingresosMensuales: handler((anio) => service.ingresosMensuales(anio)),
  reservasEventoMes: handler((anio) => service.reservasEventoMes(anio)),
  eventosAgenteCiudad: handler(() => service.eventosAgenteCiudad()),
  eventosUbicacion: handler(() => service.eventosUbicacion()),
  historialReservasCliente: handler(() => service.historialReservasCliente()),
  reservasCanceladas: handler(() => service.reservasCanceladas()),
  eventosCancelados: handler(() => service.eventosCancelados())
};
