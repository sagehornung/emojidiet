'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const logger 	   = require('morgan');
const router 	   = express.Router();
const port 	     = process.env.PORT || 3003;
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const bdStrOld = 'mongodb://emojidietweb:weight@ds123728.mlab.com:23728/emojidiet';
const dbStr =    'mongodb://emojiadmin:123weightcontrol!@ds251548.mlab.com:51548/emojidiet';
mongoose.connect(dbStr);
const cors = require('cors');
app.options('*', cors()); // include before other routes
app.use(bodyParser.json());
app.use(logger('dev'));

require('./routes')(router);
app.use('/api/v1', router);

app.listen(port);

console.log(`App Runs on ${port}`);



