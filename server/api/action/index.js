'use strict';

var express = require('express');
var controller = require('./action.controller');

var router = express.Router();

router.get('/', controller.index); // Get entire list
router.get('/:id', controller.show); // Gets one action
router.post('/', controller.create); // Creates new actionNode, passes in via body parameters
router.post('/:id', controller.createChild); // Creates child actionNode, uses both URL params, and body parameters
router.put('/', controller.update); // Triggers reset/increment on actionNode.content
router.patch('/:id', controller.edit);
router.delete('/', controller.destroy);

module.exports = router;