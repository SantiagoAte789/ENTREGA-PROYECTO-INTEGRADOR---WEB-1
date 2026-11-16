const { makeController } = require('../../utils/crud');

module.exports = makeController(require('./ciudad.service'), 'Ciudad');
