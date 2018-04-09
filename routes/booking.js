const express = require('express');
const user     = require('../models/User');
const booking = require('../models/Booking');
const hospital = require('../models/Hospital');
const htmlresponse = require('../utils/htmlresponse');

// BOOKING ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
//==============================================================================

router.route('/:tid/pending')
          .get(function(req, res) {
          //var userid = parseInt(req.params.userid, 10);
          var tid = req.params.tid;
          booking.queryPendingBooking(tid, function(err, result){
            if (err){
                res.status(500);
                res.json(htmlresponse.error(err, 'GET /booking/'+ tid + '/pending'));
                return;
              }
            if(result != null && result.affectedRows == 0){
              res.status(404);
              res.json(htmlresponse.error('NOTFOUND', 'GET /booking' + tid + '/pending'));
              return;
            }
              res.json(result);
    });
});

router.route('/:userid/history')
          .get(function(req, res) {
          var userid = parseInt(req.params.userid, 10);
          booking.queryAllBooking(userid, function(err, total, result){
            if (err){
                res.status(500);
                res.json(htmlresponse.error(err, 'GET /booking/'+ userid + '/history'));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.status(404);
               res.json(htmlresponse.error('NOTFOUND', 'GET /booking' + userid + '/history'));
               return;
            }
              res.json(result);
    });
});

router.route('/')
      .post(function(req, res) {
          var hospitalID = req.body.hospitalID;
          var userID = req.body.userID;
          user.userAuthentication(userID, function(err0, result){
            if (err0){
                res.status(403);
                res.json(htmlresponse.error('FORBIDDEN', 'POST /booking'));
                return;
              }
          hospital.queryHospitalQueueTail(hospitalID, function(err1, queueNumber){
            if (err1){
              res.status(500);
                res.json(htmlresponse.error(err1, 'POST /booking'));
                return;
              }
                else{
                hospital.addHospitalQueueTail(hospitalID, function(err2, addstatus){
                  if (err2){
                    res.status(500);
                      res.json(htmlresponse.error(err2, 'POST /booking'));
                      return;
                    }
                  if(addstatus != null && addstatus.affectedRows == 0){
                     res.status(404);
                     res.json(htmlresponse.error('NOTFOUND', 'POST /booking'));
                     return;
                  }
                });
                request('http://localhost:8081/queues/tail', { json: true}, (err, result, refQueueNumber) => {
                  if (err){
                    res.status(500);
                      res.json(htmlresponse.error(err, 'POST /booking'));
                      return;
                    }
                  if(result != null && result.affectedRows == 0){
                     res.status(404);
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
                        res.status(500);
                          res.json(htmlresponse.error(err3, 'POST /booking'));
                          return;
                        }
                      res.status(201)
                      res.json({"tid" : tid});
                    });
                });
             }
          });
          });
        });

router.route('/:tid/QSUpdateToActive')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateQueueStatusToActive(tid, function(err, result){
            if (err){
              res.status(500);
                res.json(htmlresponse.error(err, 'PUT /booking/'+ tid + '/QSUpdateToActive'));
                return;
              }
            if(result != null && result.affectedRows == 0){
              res.status(404);
              res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/QSUpdateToActive'));
              return;
            }
            res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/QSUpdateToActive'));
          });
});
router.route('/:tid/QSUpdateToMissed')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateQueueStatusToMissed(tid, function(err, result){
            if (err){
              res.status(500);
                res.json(htmlresponse.error(err, 'PUT /booking/'+ tid + '/QSUpdateToMissed'));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.status(404);
               res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/QSUpdateToMissed'));
               return;
            }
            res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/QSUpdateToMissed'));
          });
});
router.route('/:tid/QSUpdateToReactivated')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateQueueStatusToReactivated(tid, function(err, result){
            if (err){
              res.status(500);
                res.json(htmlresponse.error(err, 'PUT /booking/'+ tid + '/QSUpdateToReactivated'));
                return;
              }
            if(result != null && result.affectedRows == 0){
               res.status(404);
               res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/QSUpdateToReactivated'));
               return;
            }
            res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/QSUpdateToReactivated'));
            // timer.start();

// timer.onTime(function(time) {
//     //console.log(time.ms); // number of milliseconds past (or remaining);
// });
          });
});

router.route('/:tid/BSUpdateToCompleted')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateBookingStatusToCompleted(tid, function(err, result){
            if (err){
              res.status(500);
                res.json(htmlresponse.error(err, 'PUT /booking/'+ tid + '/BSUpdateToCompleted'));
                return;
              }
            if(result != null && result.affectedRows == 0){
              res.status(404);
               res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/BSUpdateToCompleted'));
               return;
            }
            res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/BSUpdateToCompleted'));
          });
});
/*router.route('/:hospitalID/BSUpdateAllToAbsent')
          .put(function(req, res) {
          var tid = parseInt(req.params.hospitalID, 10);
          booking.updateAllBookingStatusesToAbsent(tid, function(err, result){
              if(!err)res.send("ABSENT");
          });
});
*/
router.route('/:tid/BSUpdateToCancelled')
          .put(function(req, res) {
          var tid = req.params.tid;
          booking.updateBookingStatusToCancelled(tid, function(err, result){
            if (err){
              res.status(500);
                res.json(htmlresponse.error(err, 'PUT /booking/'+ tid + '/BSUpdateToCancelled'));
                return;
              }
            if(result != null && result.affectedRows == 0){
              res.status(404);
               res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/BSUpdateToCancelled'));
               return;
            }
            res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/BSUpdateToCancelled'));
          });
});

module.exports = router;