const router = require('express').Router();

router.use('/paises', require('./pais.routes'));
router.use('/departamentos', require('./departamento.routes'));
router.use('/ciudades', require('./ciudad.routes'));

module.exports = router;
