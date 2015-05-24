'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ActionSchema = new Schema({
  created: { type: Date, default: Date.now}, // Date created
  title: String, // Text to be shown when creating new action
  description: {
    type: String,
    default: ''
  }, // Description if any
  content: Number, // Javascript's 'new Date().getTime()', milliseconds, single number
  children: { type: [Schema.Types.ObjectId], default: [] }, // JSON.stringified list of children
  nest_level: {
    type: Number,
    default: 0
  }, // how nested we are for children level
  // duration_type is removed because we're using moment.js which automatically changes words depending on time range
  // duration_type: Number, // 1: Hours, 2: Days, 3: Weeks // Only applicable if type 1 or 2
  type: Number, // 1: Since, 2: Until, 3: Count, 4: Countdown
  last_updated: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model('Action', ActionSchema);