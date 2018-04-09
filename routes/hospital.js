const express = require('express');
const hospital = require('../models/Hospital');
const hospitalIO = require('../sockets/HospitalSocket')
const booking = require('../models/Booking');
const htmlresponse = require('../utils/htmlresponse');

// HOSPITAL ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
//==============================================================================

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

module.exports = router;