'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const router 	   = express.Router();
const port 	     = process.env.PORT || 3003;
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://emoji:weight@ds113775.mlab.com:13775/emojidietapp');
const cors = require('cors');
app.options('*', cors()); // include before other routes
app.use(bodyParser.json());
app.use(logger('dev'));

require('./routes')(router);
app.use('/api/v1', router);

app.listen(port);

console.log(`App Runs on ${port}`);
