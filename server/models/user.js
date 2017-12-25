
'use strict';

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = mongoose.Schema({

  name 			: String,
  email			: String,
  hashed_password	: String,
  created_at		: String,
  temp_password	: String,
  temp_password_time: String,
  score: {
    current_week_start_date: Date,
    current_week: Number,
    last_week: Number,
    current_month: Number,
    lifetime: Number
  }
});



mongoose.Promise = global.Promise;
mongoose.connect('mongodb://emoji:weight@ds113775.mlab.com:13775/emojidietapp');

module.exports = mongoose.model('user', userSchema);
