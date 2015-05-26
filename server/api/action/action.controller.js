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

// Creates a new child action in the DB.
exports.createChild = function(req, res) {
  var actionID = req.params.id; // TODO: maybe try to do some auth here or in the chained routing?
  var childTitle = req.body.title;
  
  Action.findById(actionID).exec(function (err, action) {
    if(err) { return handleError(res, err); }

    // Hold value of parent action in scope
    var parentAction = action;

    // Set child Action data
    // childAction.title = childTitle;
    // childAction.nest_level = parentAction.nest_level+1;

    // Declare and initialize child action and fields. 
    var childFields = _.merge({}, parentAction.toJSON(), {'title': childTitle, 'nest_level':parentAction.nest_level+1});

    delete childFields._id; // Merge will take parent's id, so clear it, the save() will auto insert newest one
    childFields.children = []; // Merge will take any of the parent's children so we should clear it

    // Just set to 0 for now, don't know if we want to auto-trigger update on the timed actions
    switch(childFields.type){
      case 1:
        childFields.content = 0
        break;
      case 3:
        childFields.content = 0
        break;
    }
    var childAction = new Action(childFields);
    childAction.save(function (err, action) {
      if(err) { return handleError(res, err); }
      // Add newly created child's id to parent's children array
      parentAction.children.push(action._id);
      parentAction.save(function (err, action) {
        return res.json(201, action);
      });
    });
  });
};

// Resets/increments an existing action in the DB.
exports.update = function(req, res) {
  var actionID = req.body.id; // TODO: maybe try to do some auth here or in the chained routing?

  if(req.body._id) { delete req.body._id; }
  Action.findById(actionID, function (err, action) {
    if (err) { return handleError(res, err); }
    if(!action) { return res.send(404); }
    // var updated = _.merge(action, req.body);
    var updated = action;

    // Different situation depending on type of action
    switch(action.type){
      case 1: // Time since
        updated.content = (new Date()).getTime();
        break;
      case 3: // Count
        updated.content++;
        break;
    }
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, action);
    });
  });
};

exports.edit = function(req, res) {
  var actionID = req.params.id; // TODO: maybe try to do some auth here or in the chained routing?
  var actionTitle = req.body.title;

  if(req.body._id) { delete req.body._id; }
  Action.findById(actionID, function (err, action) {
    if (err) { return handleError(res, err); }
    if(!action) { return res.send(404); }
    var edited = _.merge(action, req.body);

    edited.save(function (err) {
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