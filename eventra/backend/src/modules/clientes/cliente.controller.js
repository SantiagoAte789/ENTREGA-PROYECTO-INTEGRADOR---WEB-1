const { makeController } = require('../../utils/crud');

module.exports = makeController(require('./cliente.service'), 'Cliente');
