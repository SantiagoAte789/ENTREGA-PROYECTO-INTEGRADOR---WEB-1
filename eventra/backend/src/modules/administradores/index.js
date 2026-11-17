const router = require('express').Router();

router.use('/administradores', require('./administrador.routes'));
router.use('/reportes', require('./reportes.routes'));

module.exports = router;
