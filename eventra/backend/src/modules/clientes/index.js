const router = require('express').Router();

router.use('/personas', require('./persona.routes'));
router.use('/clientes', require('./cliente.routes'));
router.use('/reservas', require('./reserva.routes'));

module.exports = router;
