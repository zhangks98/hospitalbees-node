// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
const path = require('path');
const http = require('http');
const express = require('express');        // call express
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request');

const database = require('./utils/Database');

// RESTful API Routes 
const index = require('./routes/index');
const user = require('./routes/user');
const booking = require('./routes/booking');

// Socket.IO
const HospitalSocket = require('./sockets/HospitalSocket');
const UserSocket = require('./sockets/UserSocket');


const port = process.env.PORT || 3000;        // set our port
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(server);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

// REGISTER OUR ROUTES -------------------------------

// all of our routes will be prefixed with /api
app.use('/api', index);
app.use('/api/user', user);
app.use('/api/booking', booking);

// hospital io
var hospitalIO = io.of('/hospital');
HospitalSocket.connect(hospitalIO);
var userIO = io.of('/user');

// START THE SERVER
// =============================================================================
server.listen(port, () => {
  console.log('Magic happens on port ' + port);
});
database.starts();
