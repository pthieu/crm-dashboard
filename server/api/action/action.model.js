'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ActionSchema = new Schema({
  created: { type: Date, default: Date.now}, // Date created
  title: String, // Text to be shown when creating new action
  description: String, // Description if any
  content: Number, // Javascript's 'new Date().getTime()', milliseconds, single number
  children: { type: String, default: [] }, // JSON.stringified list of children
  nest_level: Number, // how nested we are for children level
  duration_type: Number, // 1: Hours, 2: Days, 3: Weeks // Only applicable if type 1 or 2
  type: Number, // 1: Since, 2: Until, 3: Count, 4: Countdown
  last_updated: {
    type: Date,
    default: Date.now
  },
  active: Boolean
});

module.exports = mongoose.model('Action', ActionSchema);