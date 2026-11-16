const { makeController } = require('../../utils/crud');

module.exports = makeController(require('./persona.service'), 'Persona');
