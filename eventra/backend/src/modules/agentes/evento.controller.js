const { makeController } = require('../../utils/crud');

module.exports = makeController(require('./evento.service'), 'Evento');
