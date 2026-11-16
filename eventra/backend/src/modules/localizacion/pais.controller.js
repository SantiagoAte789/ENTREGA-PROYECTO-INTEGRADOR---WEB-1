const { makeController } = require('../../utils/crud');

module.exports = makeController(require('./pais.service'), 'País');
