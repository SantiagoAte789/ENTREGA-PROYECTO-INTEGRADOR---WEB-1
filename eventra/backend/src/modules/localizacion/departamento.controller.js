const { makeController } = require('../../utils/crud');

module.exports = makeController(require('./departamento.service'), 'Departamento');
