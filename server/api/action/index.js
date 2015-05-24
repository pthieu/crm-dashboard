'use strict';

var express = require('express');
var controller = require('./action.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/', controller.update);
router.patch('/:id', controller.update);
router.delete('/', controller.destroy);

module.exports = router;