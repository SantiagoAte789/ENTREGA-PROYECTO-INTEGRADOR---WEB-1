const { makeController } = require('../../utils/crud');

module.exports = makeController(require('./reserva.service'), 'Reserva');
