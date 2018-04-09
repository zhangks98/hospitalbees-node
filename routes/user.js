const express = require('express');
const user = require('../models/User');
const htmlresponse = require('../utils/htmlresponse');

// USER ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
//==============================================================================

router.route('/')
// create a bear (accessed at POST http://localhost:8080/api/)
	.post(function (req, res) {
		var nric = req.body.nric;
		var name = req.body.name;
		var password = req.body.password;
		var phoneNumber = req.body.phoneNumber;
		// save the bear and check for errors
		user.addUser(nric, name, password, phoneNumber, function (err, success) {
			if (err) {
				res.json(htmlresponse.error(err, 'POST /user'));
				return;
			}
			if (success != null && success.affectedRows == 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'POST /user'));
				return;
			}
			res.status(201);
			res.json(htmlresponse.success(201, success, 'POST /user'));
		});
	});

router.route('/:nric/blockAccount')
	.put(function (req, res) {
		var nric = req.params.nric;
		user.blockUser(nric, function (err, success) {
			if (err) {
				res.json(htmlresponse.error(err, 'PUT /user/' + nric + '/blockAccount'));
				return;
			}
			if (success != null && success.affectedRows == 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'PUT /user' + nric + '/blockAccount'));
				return;
			}
			res.json(htmlresponse.success(200, success, 'PUT /user/' + nric + '/blockAccount'));
		});
	});

router.route('/:phoneNumber/:password')
	.get(function (req, res) {
		var phoneNumber = req.params.phoneNumber;
		var password = req.params.password;
		user.queryUser(phoneNumber, password, function (err, result) {
			if (err) {
				res.json(htmlresponse.error(err, 'GET /user/' + phoneNumber + '/' + password));
				return;
			}
			res.json(result);
		});
	})
	.delete(function (req, res) {
		var phoneNumber = req.params.phoneNumber;
		var password = req.params.password;
		user.deleteUser(phoneNumber, password, function (err, result) {
			if (err) {
				res.json(htmlresponse.error(err, 'DELETE /user/' + phoneNumber + '/' + password));
				return;
			}
			if (result != null && result.affectedRows === 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'DELETE /user/' + phoneNumber + '/' + password));
				return;
			}
			res.json(htmlresponse.success(200, result, 'DELETE /user/' + phoneNumber + '/' + password));
		});
	});

router.route('/:nric/changeProfile')
	.put(function (req, res) {
		var nric = req.params.nric;
		var id = req.body.id;
		var name = req.body.name;
		var phoneNumber = req.body.phoneNumber;
		user.updateUserData(id, nric, name, phoneNumber, function (err, success) {
			if (err) {
				res.json(htmlresponse.error(err, 'PUT /user/' + nric + '/changeProfile'));
				return;
			}
			if (success != null && success.affectedRows == 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'PUT /user' + nric + '/changeProfile'));
				return;
			}
			res.json(htmlresponse.success(200, success, 'PUT /user' + nric + '/changeProfile'));
		});
	});

router.route('/:phoneNumber/changePassword')
	.put(function (req, res) {
		var phoneNumber = req.params.phoneNumber;
		var oldpassword = req.body.oldpassword;
		var newpassword = req.body.newpassword;
		var confirmpassword = req.body.confirmpassword;
		user.updateUserPassword(phoneNumber, oldpassword, newpassword, confirmpassword, function (err, success) {
			if (err) {
				res.json(htmlresponse.error(err, 'PUT /user/' + phoneNumber + '/changePassword'));
				return;
			}
			if (success != null && success.affectedRows == 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'PUT /user' + phoneNumber + '/changePassword'));
				return;
			}
			res.json(htmlresponse.success(200, success, 'PUT /user' + phoneNumber + '/changePassword'));
		});
	});

module.exports = router;