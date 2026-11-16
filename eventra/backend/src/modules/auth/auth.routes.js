const router = require('express').Router();
const controller = require('./auth.controller');

router.post('/login', controller.login);        // Inicio de sesión
router.post('/register', controller.register);  // Registro (cliente o agente)

module.exports = router;
