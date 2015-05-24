'use strict';

var _ = require('lodash');
var Action = require('./action.model');

Action.schema.pre('remove', function (next) {
  var deleted = this; //referring to action being deleted
  // Remove child actions -- go through each child of the delete actions' children array and delete them
  deleted.children.forEach(function(child){
    Action.findOne({'_id':child}).remove();
  });

  // TODO: should this be placed into next or post?
  // Remove parent (should only have one parent) by looking for any actions that have the deleted action's ID in children array
  Action.findOne({'children': deleted.id}, function(err, doc){
    if (err) { return console.log(err); }

    if (!doc) return; // no doc found (parent of deleted), so return and continue with life

    doc.children.pull(deleted.id);
    doc.save(function(err) {
      if (err) { return console.log(err); }
    });
  });

  next();
});

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
  var action_content; // declaration for now, fill in switch case below 
  var action_type = req.body.type;
  switch(action_type){
    case 1: // Time since
      action_content = (new Date()).getTime();
      break;
    case 2: // Time until
      break;
    case 3: // Count
      action_content = 0 // start count
      break;
    case 4: // Countdown
      break;
  }

  var action = new Action(_.merge({content: action_content, nest_level:0}, req.body));
  action.save(function(err, action) {
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
  var actionID = req.body.id; // TODO: maybe try to do some auth here or in the chained routing?

  var promise = Action.findById(actionID).exec(function (err, action) {
    if(err) { return handleError(res, err); }
    if(!action) { return res.send(404); }
    var promise = action.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
  // promise.then(function (action) {
  //   return Action.remove({'_id': action.id}).exec();
  // }).then(function (err, action, something) {
  //   debugger;
  // });
};

function handleError(res, err) {
  return res.send(500, err);
}