const hospitalSocket = require("../sockets/HospitalSocket");

var io;

const TAG = "models.HospitalIO";


var setSocket = (socket) => {
	io = socket;
}

var getHospital= (hospitalId) => {
	if (io) {
		var hospital = hospitalSocket.getHospitalByHospitalId(hospitalId);
		if (hospital) {
			return hospital;
		} else {
			throw new Error(`Cannot find hospital [${hospitalId}]`)
		}
	} else {
		throw new Error(`Error connecting to the hospital [${hospitalId}]`);
	}
}

var getOpenedHospitals = (callback) => {
	return callback(undefined, hospitalSocket.getOpenedHospitals());
}

var getQueueTail = (hospitalId, callback) => {
	try {
		var hospital = getHospital(hospitalId);
		io.connected[hospital.socketId].emit('peekLast', (tail) => {
			var tailElement = JSON.parse(tail)
			if (tailElement) {
				callback(undefined, tailElement);
			} else {
				callback(`Error fetching queue tail of hospital [${hospitalId}]`)
			}
		});
	} catch (e) {
		console.error(TAG, e.message);
		callback(e.message);
	}
}

var getQueueLength = (hospitalId, callback) => {
	try {
		var hospital = getHospital(hospitalId);
		io.connected[hospital.socketId].emit('getLength', (length) => {
			var qlength = Number(length);
			if (qlength >= 0) {
				callback(undefined, qlength);
			} else {
				callback(`Error fetching queue length of hospital [${hospitalId}]: ${length}`);
			}
		});
	} catch (e) {
		console.error(TAG, e.message);
		callback(e.message);
	}
}

var getQueueLengthFrom = (hospitalId, queueNumber, callback) => {
	try {
		var hospital = getHospital(hospitalId);
		io.connected[hospital.socketId].emit('getLengthFrom', queueNumber, (length) => {
			var qlength = Number(length);
			if (qlength >= 0) {
				callback(undefined, qlength);
			} else {
				callback(`Error fetching queue length from ${queueNumber} of hospital [${hospitalId}]: ${length}`);
			}
		});
	} catch (e) {
		console.error(TAG, e.message);
		callback(e.message);
	}
}

var getQueueDetails = (hospitalId, queueNumber, callback) => {
	try {
		var hospital = getHospital(hospitalId);
		io.connected[hospital.socketId].emit('getQueueDetails', queueNumber, (q) => {
			var qElement = JSON.parse(q);
			if (qElement) {
				callback(undefined, qElement);
			} else {
				callback(`Error fetching details of queue number ${queueNumber} of hospital [${hospitalId}]`)
			}
		});
	} catch (e) {
		console.error(TAG, e.message);
		callback(e.message);
	}
}

module.exports = {setSocket, getOpenedHospitals, getQueueTail, getQueueLength, getQueueLengthFrom, getQueueDetails}

