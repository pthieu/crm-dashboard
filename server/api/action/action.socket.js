/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Action = require('./action.model');

exports.register = function(socket) {
  Action.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Action.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('action:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('action:remove', doc);
}