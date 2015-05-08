// TODO REWRITE
/*
'use strict';

var express = require('express');
var controller = require('./comment.controller');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
*/
// server/api/comment/index.js
'use strict';
 
var express = require('express');
var controller = require('./comment.controller');
var auth = require('../../auth/auth.service');
 
var router = express.Router();
  
router.get('/', controller.index);
//router.post('/', auth.isAuthenticated(), controller.create); //TODO REWRITE
router.post('/', controller.create);
router.delete('/:id', auth.isAuthenticated(), controller.destroy);
 
module.exports = router;