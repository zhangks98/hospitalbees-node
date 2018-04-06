// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var database = require('./Database.js');
var user     = require('./User.js');
var booking = require('./Booking.js');
var hospital = require('./Hospital.js');
var request = require('request');
var htmlresponse = require('./htmlresponse.js');
var Stopwatch = require('timer-stopwatch');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
//==============================================================================
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});
//==============================================================================
router.route('/user')
    // create a bear (accessed at POST http://localhost:8080/api/)
    .post(function(req, res) {
        var nric = req.body.nric;
        var name = req.body.name;
        var password = req.body.password;
        var phoneNumber = req.body.phoneNumber;
      // save the bear and check for errors
        user.addUser(nric, name, password, phoneNumber, function(err, success){
          if (err){
              res.json(htmlresponse.error(err, 'POST /user'));
              return;
            }
          if(success != null && success.affectedRows == 0){
             res.json(htmlresponse.error('NOTFOUND', 'POST /user'));
             return;
          }
          res.json(htmlresponse.success(201, success, 'POST /user'));
        });
    });

router.route('/user/:nric/blockAccount')
          .put(function(req, res) {
              var nric = req.params.nric;
              user.blockUser(nric, function(err, success){
                if (err){
                    res.json(htmlresponse.error(err, 'PUT /user/'+ nric + '/blockAccount'));
                    return;
                  }
                if(success != null && success.affectedRows == 0){
                   res.json(htmlresponse.error('NOTFOUND', 'PUT /user' + nric + '/blockAccount'));
                   return;
                }
                  res.json(htmlresponse.success(200, success, 'PUT /user/'+ nric + '/blockAccount'));
  });
});

router.route('/user/:phoneNumber/:password')
  .get(function(req, res) {
    var phoneNumber = req.params.phoneNumber;
    var password = req.params.password;
    user.queryUser(phoneNumber, password, function(err, result){
      if (err){
          res.json(htmlresponse.error(err, 'GET /user/'+ phoneNumber + '/' + password));
          return;
        }
      res.json(result);
    });
  })
  .delete(function(req, res){
      var phoneNumber = req.params.phoneNumber;
      var password = req.params.password;
      user.deleteUser(phoneNumber, password, function(err, result){
        if (err){
            res.json(htmlresponse.error(err, 'DELETE /user/'+ phoneNumber + '/' + password));
            return;
          }
        if(result != null && result.affectedRows == 0){
            res.json(htmlresponse.error('NOTFOUND', 'DELETE /user/'+ phoneNumber + '/' + password));
            return;
          }
        res.json(htmlresponse.success(200, result, 'DELETE /user/'+ phoneNumber + '/' + password));
    });
  });

router.route('/user/:nric/changeProfile')
.put(function(req, res){
  var nric = req.params.nric;
  var id = req.body.id;
  var name = req.body.name;
  var phoneNumber = req.body.phoneNumber;
  user.updateUserData(id, nric, name, phoneNumber, function(err, success){
    if (err){
        res.json(htmlresponse.error(err, 'PUT /user/'+ nric + '/changeProfile'));
        return;
      }
    if(success != null && success.affectedRows == 0){
       res.json(htmlresponse.error('NOTFOUND', 'PUT /user' + nric + '/changeProfile'));
       return;
    }
    res.json(htmlresponse.success(200, success, 'PUT /user' + nric + '/changeProfile'));
  });
});

router.route('/user/:phoneNumber/changePassword')
.put(function(req, res){
  var phoneNumber = req.params.phoneNumber;
  var oldpassword = req.body.oldpassword;
  var newpassword = req.body.newpassword;
  var confirmpassword = req.body.confirmpassword;
  user.updateUserPassword(phoneNumber, oldpassword, newpassword, confirmpassword, function(err, success){
    if (err){
        res.json(htmlresponse.error(err, 'PUT /user/'+ phoneNumber + '/changePassword'));
        return;
      }
    if(success != null && success.affectedRows == 0){
       res.json(htmlresponse.error('NOTFOUND', 'PUT /user' + phoneNumber + '/changePassword'));
       return;
    }
    res.json(htmlresponse.success(200, success, 'PUT /user' + phoneNumber + '/changePassword'));
  });
});

router.route('/booking/:tid/pending')
          .get(function(req, res) {
          //var userid = parseInt(req.params.userid, 10);
          var tid = req.params.tid;
          booking.queryPendingBooking(tid, function(err, result){
            if (err){
                res.json(htmlresponse.error(err, 'GET /booking/'+ tid + '/pending'));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.json(htmlresponse.error('NOTFOUND', 'GET /booking' + tid + '/pending'));
               return;
            }
              res.json(result);
    });
});

router.route('/booking/:userid/history')
          .get(function(req, res) {
          var userid = parseInt(req.params.userid, 10);
          booking.queryAllBooking(userid, function(err, total, result){
            if (err){
                res.json(htmlresponse.error(err, 'GET /booking/'+ userid + '/history'));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.json(htmlresponse.error('NOTFOUND', 'GET /booking' + userid + '/history'));
               return;
            }
              res.json(result);
    });
});

router.route('/booking')
      .post(function(req, res) {
          var hospitalID = req.body.hospitalID;
          var userID = req.body.userID;
          user.userAuthentication(userID, function(err0, result){
            if (err0){
                res.json(htmlresponse.error('FORBIDDEN', 'POST /booking'));
                return;
              }
          hospital.queryHospitalQueueTail(hospitalID, function(err1, queueNumber){
            if (err1){
                res.json(htmlresponse.error(err1, 'POST /booking'));
                return;
              }
                else{
                hospital.addHospitalQueueTail(hospitalID, function(err2, addstatus){
                  if (err2){
                      res.json(htmlresponse.error(err2, 'POST /booking'));
                      return;
                    }
                  if(addstatus != null && addstatus.affectedRows == 0){
                     res.json(htmlresponse.error('NOTFOUND', 'POST /booking'));
                     return;
                  }
                });
                request('http://localhost:8081/queues/tail', { json: true}, (err, result, refQueueNumber) => {
                  if (err){
                      res.json(htmlresponse.error(err, 'POST /booking'));
                      return;
                    }
                  if(result != null && result.affectedRows == 0){
                     res.json(htmlresponse.error('NOTFOUND', 'POST /booking'));
                     return;
                  }
                  //console.log(body);
                  queueNumber = queueNumber.Hospital_QueueTail;
                  refQueueNumber = refQueueNumber.queueNumber;
                  var time = req.body.time;
                  var queueStatus = 'INACTIVE';
                  var bookingStatus = 'PENDING';
                  booking.addBooking(time, queueStatus, bookingStatus, queueNumber, refQueueNumber, userID,
                    hospitalID, function(err3, tid){
                      if (err3){
                          res.json(htmlresponse.error(err3, 'POST /booking'));
                          return;
                        }
                      res.json({"tid" : tid});
                    });
                });
             }
          });
          });
        });

router.route('/booking/:tid/QSUpdateToActive')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateQueueStatusToActive(tid, function(err, result){
            if (err){
                res.json(htmlresponse.error(err, 'PUT /booking/'+ tid + '/QSUpdateToActive'));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/QSUpdateToActive'));
               return;
            }
            res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/QSUpdateToActive'));
          });
});
router.route('/booking/:tid/QSUpdateToMissed')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateQueueStatusToMissed(tid, function(err, result){
            if (err){
                res.json(htmlresponse.error(err, 'PUT /booking/'+ tid + '/QSUpdateToMissed'));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/QSUpdateToMissed'));
               return;
            }
            res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/QSUpdateToMissed'));
          });
});
router.route('/booking/:tid/QSUpdateToReactivated')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateQueueStatusToReactivated(tid, function(err, result){
            if (err){
                res.json(htmlresponse.error(err, 'PUT /booking/'+ tid + '/QSUpdateToReactivated'));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/QSUpdateToReactivated'));
               return;
            }
            res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/QSUpdateToReactivated'));
            timer.start();

timer.onTime(function(time) {
    //console.log(time.ms); // number of milliseconds past (or remaining);
});
          });
});

router.route('/booking/:tid/BSUpdateToCompleted')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateBookingStatusToCompleted(tid, function(err, result){
            if (err){
                res.json(htmlresponse.error(err, 'PUT /booking/'+ tid + '/BSUpdateToCompleted'));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/BSUpdateToCompleted'));
               return;
            }
            res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/BSUpdateToCompleted'));
          });
});
/*router.route('/booking/:hospitalID/BSUpdateAllToAbsent')
          .put(function(req, res) {
          var tid = parseInt(req.params.hospitalID, 10);
          booking.updateAllBookingStatusesToAbsent(tid, function(err, result){
              if(!err)res.send("ABSENT");
          });
});
*/
router.route('/booking/:tid/BSUpdateToCancelled')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateBookingStatusToCancelled(tid, function(err, result){
            if (err){
                res.json(htmlresponse.error(err, 'PUT /booking/'+ tid + '/BSUpdateToCancelled'));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/BSUpdateToCancelled'));
               return;
            }
            res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/BSUpdateToCancelled'));
          });
});

router.route('/hospital')
          .get(function(req, res) {
          hospital.queryOpenedHospital(function(err, result){
            if (err){
                res.json(htmlresponse.error(err, '/hospital'));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.json(htmlresponse.error('NOTFOUND', '/hospital'));
               return;
            }
            res.json(result);
    });
});
router.route('/hospital/:hospitalIPAddress')
          .get(function(req, res) {
          hospital.queryHospital(req.params.hospitalIPAddress, function(err, result){
            console.log(result);
            if (err){
                res.json(htmlresponse.error(err, 'PUT /hospital/'+ req.params.hospitalIPAddress ));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.json(htmlresponse.error('NOTFOUND', 'PUT /hospital/' + req.params.hospitalIPAddress));
               return;
            }
            res.json(result);
    });
});
router.route('/hospital/:hospitalID/close')
          .put(function(req, res) {
          hospital.closeHospital(req.params.hospitalID, function(err, result){
            if (err){
                res.json(htmlresponse.error(err, 'PUT /hospital/'+ req.params.hospitalID +'/close' ));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.json(htmlresponse.error('NOTFOUND', 'PUT /hospital/' + req.params.hospitalID + '/close'));
               return;
            }
            booking.updateAllBookingStatusesToAbsent(req.params.hospitalID, function(err2, result2){
              if (err2){
                  res.json(htmlresponse.error(err2, 'PUT /hospital/'+ req.params.hospitalID +'/close' ));
                  return;
                }
              res.json(htmlresponse.success(200, result, 'PUT /hospital/'+ req.params.hospitalID +'/close'));
            });
    });
});
router.route('/hospital/:hospitalID/open')
          .put(function(req, res) {
          hospital.openHospital(req.params.hospitalID, function(err, result){
            if (err){
                res.json(htmlresponse.error(err, 'PUT /hospital/'+ req.params.hospitalID +'/open' ));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.json(htmlresponse.error('NOTFOUND', 'PUT /hospital/' + req.params.hospitalID + '/open'));
               return;
            }
            res.json(htmlresponse.success(200, result, 'PUT /hospital/'+ req.params.hospitalID +'/open'));
    });
});
// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
database.starts();
console.log('Magic happens on port ' + port);

//OTHER FUNCTIONS
let timer = new Stopwatch(6000);
timer.onDone(function(){
  booking.updateBookingStatusesToAbsent(req.params.hospitalID, function(err2, result2){
    if (err2){
        res.json(htmlresponse.error(err2, 'PUT /hospital/'+ req.params.hospitalID +'/close' ));
        return;
      }
    res.json(htmlresponse.success(200, result, 'PUT /hospital/'+ req.params.hospitalID +'/close'));
  });
});
