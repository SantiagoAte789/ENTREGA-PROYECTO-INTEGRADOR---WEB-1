const router = require('express').Router();

router.use('/agentes', require('./agente.routes'));
router.use('/eventos', require('./evento.routes'));

module.exports = router;
