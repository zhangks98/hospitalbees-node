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
const {router} = require('./Routes')
// var Stopwatch = require('timer-stopwatch');
var app = express();
var server = http.createServer(app);
var io = require('socket.io')(http);

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

var port = process.env.PORT || 3000;        // set our port

// REGISTER OUR ROUTES -------------------------------

// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
server.listen(port, () => {
  console.log('Magic happens on port ' + port);
});
//database.starts();

//OTHER FUNCTIONS
// let timer = new Stopwatch(6000);
// timer.onDone(function(){
//   booking.updateBookingStatusesToAbsent(req.params.hospitalID, function(err2, result2){
//     if (err2){
//         res.json(htmlresponse.error(err2, 'PUT /hospital/'+ req.params.hospitalID +'/close' ));
//         return;
//       }
//     res.json(htmlresponse.success(200, result, 'PUT /hospital/'+ req.params.hospitalID +'/close'));
//   });
// });
