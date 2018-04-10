const express = require('express');
const hospital = require('../models/Hospital');
const hospitalIO = require('../models/HospitalIO');
const booking = require('../models/Booking');
const htmlresponse = require('../utils/htmlresponse');

// HOSPITAL ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
//==============================================================================

router.route('/')
	.get(function (req, res) {
		hospitalIO.getOpenedHospitals(function (err, result) {
			if (err) {
				res.status(500).json(htmlresponse.error(err, '/hospital'));
				return;
			}
			res.json(result);
		});
	});

// ! The get tail route is only for testing, no production usage
router.route('/:hospitalID/tail')
.get((req, res) => {
  const TAG = 'GET /hospital/' + req.params.hospitalID + '/tail';
    hospitalIO.getQueueTail(req.params.hospitalID, function (err, result) {
      if (err) {
        res.status(500).json(htmlresponse.error(err, TAG));
        return;
      }
      res.json(result);
    });
});

router.route('/:hospitalID/length')
	.get(function (req, res) {
		const TAG = 'GET /hospital/' + req.params.hospitalID + '/length';
		hospitalIO.getQueueLength(req.params.hospitalID, function (err, result) {
			if (err) {
				res.status(500).json(htmlresponse.error(err, TAG));
				return;
			}
			res.json(result);
		});
	});

router.route('/:hospitalID/:queueNumber/length')
	.get(function (req, res) {
		const TAG = 'GET /hospital/' + req.params.hospitalID + '/' + req.params.queueNumber + '/length';
		hospitalIO.getQueueLengthFrom(req.params.hospitalID, req.params.queueNumber, function (err, result) {
			if (err) {
				res.status(500).json(htmlresponse.error(err, TAG));
				return;
			}
			res.json(result);
		});
	});

router.route('/:hospitalID/close')
	          .put(function(req, res) {
	    const hospitalId = req.params.hospitalID;
		const TAG = 'PUT /hospital/' + hospitalId + '/close';
        booking.updateAllBookingStatusesToAbsent(Number(hospitalId), (err, result) => {
            if (err) {
				res.status(500).json(htmlresponse.error(err, TAG));
				return;
			}
        });
        hospital.closeHospital(hospitalId, (err, result) => {
        	if (err) {
				res.status(500).json(htmlresponse.error(err, TAG));
				return;
			}
        });
		res.status(200);
	});

module.exports = router;
