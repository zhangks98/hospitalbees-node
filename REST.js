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
        user.addUser(nric, name, password, phoneNumber, function(success){
          if (!success)
              res.send("Sorry but the User creation is failed");
          res.json({ message: 'User created!' });
        });
    });

router.route('/user/:nric/blockAccount')
          .put(function(req, res) {
              var nric = req.params.nric;
              user.blockUser(nric, function(success){
                  if(success==1)res.send("BLOCKED");
  });
});

router.route('/user/:nric/:password')
.get(function(req, res) {
  var nric = req.params.nric;
  var password = req.params.password;
  user.queryUser(nric, password, function(success, result){
  if(!success) res.send("oops!");
  else
    res.json(result);
});
})
.delete(function(req, res){
      var nric = req.params.nric;
      user.deleteUser(nric, function(success){
      if(success){
        res.send("The account has been deleted.");
      }
    });
  });

router.route('/user/:nric/changeProfile')
.put(function(req, res){
  var id = req.body.id;
  var name = req.body.name;
  var nric = req.params.nric;
  var phoneNumber = req.body.phoneNumber;
  user.updateUserData(id, nric, name, phoneNumber, function(success){
    if(success){res.send("Profile has been updated.");}
  });
});

router.route('/user/:nric/changePassword')
.put(function(req, res){
  var nric = req.params.nric;
  var oldpassword = req.body.oldpassword;
  var newpassword = req.body.newpassword;
  var confirmpassword = req.body.confirmpassword;
  user.updateUserPassword(nric, oldpassword, newpassword, confirmpassword, function(success){
    if(success){res.send("Password has been updated");}
    else {res.send("The Password is failed to be updated");}
  });
});

router.route('/booking/:userid/pending')
          .get(function(req, res) {
          var userid = parseInt(req.params.userid, 10);
          booking.queryPendingBooking(userid, function(success, result){
            if(!success) res.send("oops!");
            else
              res.json(result);
    });
});

router.route('/booking/:userid/history')
          .get(function(req, res) {
          var userid = parseInt(req.params.userid, 10);
          booking.queryAllBooking(userid, function(success, total, result){
            if(!success) res.send("oops!");
            else{
              res.json(result);
            }
    });
});

router.route('/booking')
      .post(function(req, res) {
          var hospitalID = req.body.hospitalID;
          hospital.queryHospitalQueueTail(hospitalID, function(success1, queueNumber){
              if(!success1) res.send("oops!");
                else{
                queueNumber = JSON.parse(JSON.stringify(queueNumber))[0].Hospital_QueueTail;
                hospital.addHospitalQueueTail(req.body.hospitalID, function(success2){
                if(success2==1)console.log("ADDED");
                });
                request('http://localhost:8081/queues/tail', { json: true}, (err, result, refQueueNumber) => {
                  if (err) {console.log(err); return callback(0, null) }
                  //console.log(body);
                  refQueueNumber = refQueueNumber.queueNumber;
                  var time = req.body.time;
                  var queueStatus = 'INACTIVE';
                  var bookingStatus = 'PENDING';
                  var userID = req.body.userID;
                  var tid = padding(hospitalID) + time.replace(/\s/g, 'T') + padding(queueNumber);
                  booking.addBooking(tid, time, queueStatus, bookingStatus, padding(queueNumber), refQueueNumber, userID,
                    hospitalID, function(success3, tid){
                      if(success3) res.send(tid);
                });
            });
          }
          });
});

router.route('/booking/:tid/QSUpdateToActive')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateQueueStatusToActive(tid, function(success){
              if(success==1)res.send("ACTIVE");
          });
});
router.route('/booking/:tid/QSUpdateToMissed')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateQueueStatusToMissed(tid, function(success){
              if(success==1)res.send("MISSED");
          });
});
router.route('/booking/:tid/QSUpdateToReactivated')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateQueueStatusToReactivated(tid, function(success){
              if(success==1)res.send("REACTIVATED");
          });
});

router.route('/booking/:tid/BSUpdateToCompleted')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateBookingStatusToCompleted(tid, function(success){
              if(success==1)res.send("COMPLETED");
          });
});
router.route('/booking/:hospitalID/BSUpdateAllToAbsent')
          .put(function(req, res) {
          var tid = parseInt(req.params.hospitalID, 10);
          booking.updateAllBookingStatusesToAbsent(tid, function(success){
              if(success==1)res.send("ABSENT");
          });
});
router.route('/booking/:tid/BSUpdateToCancelled')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateBookingStatusToCancelled(tid, function(success){
              if(success==1)res.send("CANCELLED");
          });
});

router.route('/hospital')
          .get(function(req, res) {
          hospital.queryOpenedHospital(function(success, result){
            if(!success) res.send("oops!");
            else
              res.json(result);
    });
});
router.route('/hospital/:hospitalIPAddress')
          .get(function(req, res) {
          hospital.queryHospital(req.params.hospitalIPAddress, function(success, result){
            if(!success) res.send("oops!");
            else
              res.json(result);
    });
});
router.route('/hospital/:hospitalIPAddress/close')
          .put(function(req, res) {
          hospital.closeHospital(req.params.hospitalIPAddress, function(success){
              if(success==1)res.send("CLOSED");
    });
});
router.route('/hospital/:hospitalIPAddress/open')
          .put(function(req, res) {
          hospital.openHospital(req.params.hospitalIPAddress, function(success){
              if(success==1)res.send("OPENED");
    });
});

router.route('/hospital/:hospitalID/queueTail')
          .put(function(req, res) {
          hospital.addHospitalQueueTail(req.params.hospitalID, function(success){
              if(success==1)res.send("RETURNED");
    });
})
          .get(function(req, res) {
          hospital.queryHospitalQueueTail(req.params.hospitalID, function(success, result){
              if(!success) res.send("oops!");
                else
              res.json(result);
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
function padding(n){
    if(n>999){
      return "" + n;
    }
    else if(n>99){
      return "0" + n;
    }
    else if(n>9){
        return "00" + n;
    }
    else
        return "000" + n;
}
