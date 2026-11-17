const { makeController } = require('../../utils/crud');

module.exports = makeController(require('./agente.service'), 'Agente');
