const router = require('express').Router();
const c = require('./reportes.controller');

router.get('/general', c.general);
router.get('/promedio-ingresos-agente', c.promedioIngresosAgente);
router.get('/promedio-ingresos-cliente', c.promedioIngresosCliente);
router.get('/ingresos-mensuales', c.ingresosMensuales);
router.get('/reservas-evento-mes', c.reservasEventoMes);
router.get('/eventos-agente-ciudad', c.eventosAgenteCiudad);
router.get('/eventos-ubicacion', c.eventosUbicacion);
router.get('/historial-reservas-cliente', c.historialReservasCliente);
router.get('/reservas-canceladas', c.reservasCanceladas);
router.get('/eventos-cancelados', c.eventosCancelados);

module.exports = router;
