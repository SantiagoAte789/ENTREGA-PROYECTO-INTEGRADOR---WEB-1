const router = require('express').Router();
const controller = require('./ciudad.controller');

router.get('/', controller.getAll);        // GetAll
router.get('/:id', controller.getById);    // GetById
router.post('/', controller.create);       // Create
router.put('/:id', controller.update);     // Update
router.delete('/:id', controller.remove);  // Delete

module.exports = router;
