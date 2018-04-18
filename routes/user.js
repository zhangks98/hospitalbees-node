const express = require('express');
const user = require('../models/User');
const booking = require('../models/Booking');
const hospital = require('../models/Hospital');
const htmlresponse = require('../utils/htmlresponse');

// USER ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
//==============================================================================

router.route('/')
// create a bear (accessed at POST http://localhost:8080/api/)
	.post(function (req, res) {
		const name = req.body.name;
		const phoneNumber = req.body.phoneNumber;
		// save the bear and check for errors
		user.addUser(name, phoneNumber, function (err, success) {
			if (err) {
				res.status(500).json(htmlresponse.error(err, 'POST /user'));
				return;
			}
			if (success != null && success.affectedRows === 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'POST /user'));
				return;
			}
			res.status(201);
			res.json(htmlresponse.success(201, success, 'POST /user'));
		});
	});

router.route('/:phoneNumber/blockAccount')
	.put(function (req, res) {
		const phoneNumber = req.params.phoneNumber;
		user.blockUser(phoneNumber, function (err, success) {
			if (err) {
				res.status(500).json(htmlresponse.error(err, 'PUT /user/' + phoneNumber + '/blockAccount'));
				return;
			}
			if (success != null && success.affectedRows === 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'PUT /user' + phoneNumber + '/blockAccount'));
				return;
			}
			res.json(htmlresponse.success(200, success, 'PUT /user/' + phoneNumber + '/blockAccount'));
		});
	});

router.route('/:phoneNumber')
	.get(function (req, res) {
		const phoneNumber = req.params.phoneNumber;
		user.queryUser(phoneNumber, function (err, result) {
			if (err) {
				res.status(500).json(htmlresponse.error(err, 'GET /user/' + phoneNumber));
				return;
			}
			res.json(result);
		});
	})
	.delete(function (req, res) {
		const phoneNumber = req.params.phoneNumber;
		user.deleteUser(phoneNumber, function (err, result) {
			if (err) {
				res.status(500).json(htmlresponse.error(err, 'DELETE /user/' + phoneNumber ));
				return;
			}
			if (result != null && result.affectedRows === 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'DELETE /user/' + phoneNumber));
				return;
			}
			res.json(htmlresponse.success(200, result, 'DELETE /user/' + phoneNumber));
		});
	});

router.route('/:phoneNumber/history')
	.get(function (req, res) {
		const phoneNumber = req.params.phoneNumber;
		booking.queryAllBooking(phoneNumber, function (err, total, result) {
			if (err) {
				res.status(500);
				res.json(htmlresponse.error(err, 'GET /booking/' + phoneNumber + '/history'));
				return;
			}
			if (result != null && result.affectedRows === 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'GET /booking' + phoneNumber + '/history'));
				return;
			}
			result.forEach((book) => {
				let hospitalId = Number(book.Hospital_HospitalID);
				book.Hospital_Name = hospital.hospitalMap[hospitalId];
			});
			res.json(result);
		});
	});

router.route('/:phoneNumber/changeProfile')
	.put(function (req, res) {
		const phoneNumber = req.params.phoneNumber;
		const id = req.body.id;
		const name = req.body.name;
		user.updateUserData(id, name, phoneNumber, function (err, success) {
			if (err) {
				res.status(500).json(htmlresponse.error(err, 'PUT /user/' + phoneNumber + '/changeProfile'));
				return;
			}
			if (success != null && success.affectedRows === 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'PUT /user' + phoneNumber + '/changeProfile'));
				return;
			}
			res.json(htmlresponse.success(200, success, 'PUT /user' + phoneNumber + '/changeProfile'));
		});
	});

router.route('/:phoneNumber/fcmToken/:FCMToken')
.put(function (req, res) {
	const phoneNumber = req.params.phoneNumber;
	const FCMToken = req.params.FCMToken;
	user.updateFCMToken(phoneNumber, FCMToken,  function (err, success) {
		if (err) {
			res.status(500).json(htmlresponse.error(err, 'PUT /user/' + phoneNumber + '/updateNewToken'));
			return;
		}
		if (success != null && success.affectedRows === 0) {
			res.status(404);
			res.json(htmlresponse.error('NOTFOUND', 'PUT /user' + phoneNumber + '/updateNewToken'));
			return;
		}
		res.json(htmlresponse.success(200, success, 'PUT /user' + phoneNumber + '/updateNewToken'));
	});
});

module.exports = router;
