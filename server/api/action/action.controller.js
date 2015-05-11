'use strict';

var _ = require('lodash');
var Action = require('./action.model');

// Get list of actions
exports.index = function(req, res) {
  Action.find(function (err, actions) {
    if(err) { return handleError(res, err); }
    return res.json(200, actions);
  });
};

// Get a single action
exports.show = function(req, res) {
  Action.findById(req.params.id, function (err, action) {
    if(err) { return handleError(res, err); }
    if(!action) { return res.send(404); }
    return res.json(action);
  });
};

// Creates a new action in the DB.
exports.create = function(req, res) {
  var action = new Action(_.merge({content:(new Date()).getTime(), nest_level:0}, req.body));
  action.save(req.body, function(err, action) {
    if(err) { return handleError(res, err); }
    return res.json(201, action);
  });
};

// Updates an existing action in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Action.findById(req.params.id, function (err, action) {
    if (err) { return handleError(res, err); }
    if(!action) { return res.send(404); }
    var updated = _.merge(action, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, action);
    });
  });
};

// Deletes a action from the DB.
exports.destroy = function(req, res) {
  console.log(req)
  var action = new Action(_.merge({}, req.body));
  action.findById(req.body.id, function (err, action) {
    if(err) { return handleError(res, err); }
    if(!action) { return res.send(404); }
    action.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}