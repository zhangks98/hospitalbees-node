const express = require('express');
const user = require('../models/User');
const booking = require('../models/Booking');
const hospital = require('../models/Hospital');
const hospitalIO = require('../models/HospitalIO');
const htmlresponse = require('../utils/htmlresponse');
const moment = require('moment');

const waitingTimePerPerson = 10;
const defaultETA = 20;
const missTimeAllowed = 30;

// BOOKING ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router
//==============================================================================
router.route('/')
	.post(function (req, res) {
		const hospitalID = Number(req.body.hospitalID);
		const userPhoneNumber = req.body.phoneNumber;
		const eta = Number(req.body.eta);

		user.queryUser(userPhoneNumber, function (err0, result) {
			if (err0) {
				res.status(404).json(htmlresponse.error('NOTFOUND', 'POST /booking - cannot find user'));
				return;
			}
			booking.checkDuplicatePendingBooking(userPhoneNumber, (err4, hasPendingBooking, duplicateDetails) => {
				if(err4) {
					res.status(500).json(htmlresponse.error(err1, 'POST /booking - checkPendingBooking'));
					return;
				}
				if (hasPendingBooking) {
					res.status(409).json(htmlresponse.error('COLLISION', 'POST /booking - has duplicate booking ' + duplicateDetails));
					return;
				}
				hospital.generateQueueNumber(hospitalID, function (err1, queueNumber) {
					if (err1) {
						res.status(500).json(htmlresponse.error(err1, 'POST /booking'));
						return;
					} else {
						hospital.incQueueNumberGenerator(hospitalID, function (err2, addstatus) {
							if (err2) {
								res.status(500).json(htmlresponse.error(err2, 'POST /booking'));
								return;
							}
							if (addstatus != null && addstatus.affectedRows === 0) {
								res.status(404).json(htmlresponse.error('NOTFOUND', 'POST /booking'));
								return;
							}
						});
						hospitalIO.getQueueTail(hospitalID, (err, tailQueueElement) => {
							if (err) {
								res.status(500);
								res.json(htmlresponse.error(err, 'socketIO: getQueueTail'));
								return;
							}
							const qNumber = Number(queueNumber.Hospital_QueueTail);
							const refQueueNumber = tailQueueElement.queueNumber;
							const queueLength = tailQueueElement.queueLength;
							const time = moment().utc().format();
							const queueStatus = 'INACTIVE';
							const bookingStatus = 'PENDING';
							let totalEta = Math.max(eta, queueLength * waitingTimePerPerson, defaultETA);
							booking.addBooking(time, totalEta, queueStatus, bookingStatus, qNumber, refQueueNumber, userPhoneNumber,
								hospitalID, function (err3, tid) {
									if (err3) {
										res.status(500);
										res.json(htmlresponse.error(err3, 'POST /booking'));
										return;
									}
									console.log("CREATED BOOKING", tid);
									res.status(201).json({"tid": tid});
								});

						});
					}
				});
			});
		});
	});

router.route('/:tid')
	.get(function (req, res) {
		//var userid = parseInt(req.params.userid, 10);
		const tid = req.params.tid;
		const TAG = 'GET /booking/' + tid;
		booking.queryBooking(tid, function (err, result) {
			if (err) {
				res.status(500).json(htmlresponse.error(err, TAG));
				return;
			}
			if (!result || result && result.affectedRows === 0) {
				res.status(404).json(htmlresponse.error('NOTFOUND', TAG));
				return;
			}
			checkMissedTimeAndLengthBefore(result, (err, isAbsent, newResult) => {
				if (err) {
					res.status(500).json(htmlresponse.error(err, TAG + '- checkMissedTime'));
					return;
				} else {
					if(isAbsent) {
						res.status(410).json(htmlresponse.error(`${tid} exceeded maximum missed time and is set as absent`, TAG + '- checkMissedTime'));
						return;
					} else {
						res.status(200).json(newResult);
						return;
					}
				}
			});
		});
	});

router.route('/:tid/notifyHead')
	.post((req,res) => {
		const tid = req.params.tid;
		const TAG = 'POST /booking/' + tid + '/notifyHead';
		getFCMToken(tid, (err, fcmToken) => {
			if (err) {
				res.status(500).json(htmlresponse.error(err,TAG))
			}
			// TODO fcm messaging
			console.log(fcmToken);
			res.status(200).json();

		})
	});

router.route('/:tid/notifyApproaching')
	.post((req,res) => {
		const tid = req.params.tid;
		const TAG = 'POST /booking/' + tid + '/notifyApproaching';
		getFCMToken(tid, (err, fcmToken) => {
			if (err) {
				res.status(500).json(htmlresponse.error(err,TAG))
			}
			// TODO fcm messaging
			console.log(fcmToken);
			res.status(200).json();

		})
	});

router.route('/:tid/QSUpdateToActive')
	.put(function (req, res) {
		var tid = req.params.tid;
		booking.updateQueueStatusToActive(tid, function (err, result) {
			if (err) {
				res.status(500);
				res.json(htmlresponse.error(err, 'PUT /booking/' + tid + '/QSUpdateToActive'));
				return;
			}
			if (result != null && result.affectedRows === 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/QSUpdateToActive'));
				return;
			}
			res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/QSUpdateToActive'));
		});
	});
router.route('/:tid/QSUpdateToMissed')
	.put(function (req, res) {
		var tid = req.params.tid;
		booking.updateQueueStatusToMissed(tid, function (err, result) {
			if (err) {
				res.status(500);
				res.json(htmlresponse.error(err, 'PUT /booking/' + tid + '/QSUpdateToMissed'));
				return;
			}
			if (result != null && result.affectedRows === 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/QSUpdateToMissed'));
				return;
			}
			res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/QSUpdateToMissed'));
		});
	});
router.route('/:tid/QSUpdateToReactivated')
	.put(function (req, res) {
		var tid = req.params.tid;
		booking.updateQueueStatusToReactivated(tid, function (err, result) {
			if (err) {
				res.status(500);
				res.json(htmlresponse.error(err, 'PUT /booking/' + tid + '/QSUpdateToReactivated'));
				return;
			}
			if (result != null && result.affectedRows === 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/QSUpdateToReactivated'));
				return;
			}
			res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/QSUpdateToReactivated'));
		});
	});

router.route('/:tid/BSUpdateToCompleted')
	.put(function (req, res) {
		var tid = req.params.tid;
		booking.updateBookingStatusToCompleted(tid, function (err, result) {
			if (err) {
				res.status(500);
				res.json(htmlresponse.error(err, 'PUT /booking/' + tid + '/BSUpdateToCompleted'));
				return;
			}
			if (result != null && result.affectedRows === 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/BSUpdateToCompleted'));
				return;
			}
			res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/BSUpdateToCompleted'));
		});
	});

router.route('/:tid/BSUpdateToAbsent')
	.put(function (req, res) {
		var tid = req.params.tid;
		booking.updateBookingStatusToAbsent(tid, function (err, result) {
			if (err) {
				res.status(500);
				res.json(htmlresponse.error(err, 'PUT /booking/' + tid + '/BSUpdateToAbsent'));
				return;
			}
			if (result != null && result.affectedRows === 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/BSUpdateToAbsent'));
				return;
			}
			res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/BSUpdateToAbsent'));
		});
	});

router.route('/:tid/BSUpdateToCancelled')
	.put(function (req, res) {
		var tid = req.params.tid;
		booking.updateBookingStatusToCancelled(tid, function (err, result) {
			if (err) {
				res.status(500);
				res.json(htmlresponse.error(err, 'PUT /booking/' + tid + '/BSUpdateToCancelled'));
				return;
			}
			if (result != null && result.affectedRows === 0) {
				res.status(404);
				res.json(htmlresponse.error('NOTFOUND', 'PUT /booking' + tid + '/BSUpdateToCancelled'));
				return;
			}
			res.json(htmlresponse.success(200, result, 'PUT /booking' + tid + '/BSUpdateToCancelled'));
		});
	});

const checkMissedTimeAndLengthBefore = (result, callback) => {

	const tid = result.Booking_TID;
	const hospitalId = Number(tid.substring(0, 4));

	if(result.Booking_QueueStatus === "MISSED" || result.Booking_QueueStatus === "ACTIVE" || result.Booking_QueueStatus === "REACTIVATED") {

		hospitalIO.getQueueDetails(hospitalId, tid, (err, queueElement) => {
			if (err) {
				callback(err);
				return;
			}
			if (queueElement) {
				if (result.Booking_QueueStatus === queueElement.status
					|| result.Booking_QueueStatus === "ACTIVE" && queueElement.status === "NOTIFIED"
					|| result.Booking_QueueStatus === "REACTIVATED" && queueElement.status === "ACTIVE"
					|| result.Booking_QueueStatus === "REACTIVATED" && queueElement.status === "NOTIFIED") {
					if (result.Booking_QueueStatus === "MISSED") {
						const missedTime = Number(queueElement.missedTime);
						if (missedTime > 0) {
							let momentInstance = moment(missedTime);
							if (momentInstance.add(missTimeAllowed, 'm').isBefore(moment())) {
								booking.updateBookingStatusToAbsent(tid, (err, reslt) => {
									if (err) {
										callback(err);
									} else {
										callback(undefined, true);
									}
								});
							} else {
								result.missedTime = missedTime;
								result.missTimeAllowed = missTimeAllowed;
								callback(undefined, false, result);
							}
						}
					} else if (result.Booking_QueueStatus === "ACTIVE" && queueElement.status === "ACTIVE"
						|| result.Booking_QueueStatus === "REACTIVATED" && queueElement.status === "ACTIVE") {
						const length = Number(queueElement.lengthBefore);
						result.lengthBefore = length;
						callback(undefined, false, result);
					} else if (queueElement.status === "NOTIFIED"){
						result.lengthBefore = -1;
						callback(undefined, false, result);
					}
				} else {
					callback("Queue Status Inconsistent: Hospital - " + queueElement.status + " | HB - " + result.Booking_QueueStatus);
				}
			} else {
				callback("Error fetching queue details");
			}

		});
	} else {
		callback(undefined, false, result);
	}
};

const getFCMToken = (tid, callback) => {
	booking.queryBooking(tid, (err1, bookingData) => {
		if (err1) {
			callback(err1);
			return;
		}
		let userPhoneNumber = bookingData.User_PhoneNumber;
		if (userPhoneNumber) {
			user.queryUser(userPhoneNumber, (err, userData) => {
				if(err) {
					callback(err);
					return;
				} else {
					let fcmToken = userData.User_FCMToken;
					if (fcmToken) {
						callback(undefined, fcmToken);
					} else {
						callback("getFCMToken - FCMToken Not Found");
					}
				}
			});
		} else {
			callback("getFCMToken - cannot find UserPhoneNumber")
		}
	});

};

module.exports = router;
