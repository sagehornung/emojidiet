'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mealSchema = mongoose.Schema({
  username      : String,
  emotion 			: Number,
  pleasure			: Number,
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  created: { type: Date, default: Date.now },
  updated: { type: Date, default: Date.now }
});

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://emoji:weight@ds113775.mlab.com:13775/emojidietapp');

module.exports = mongoose.model('meal', mealSchema);
