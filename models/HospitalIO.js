const hospitalSocket = require("../sockets/HospitalSocket");

let io;

const TAG = "models.HospitalIO";


const setSocket = (socket) => {
	io = socket;
};

const getHospital= (hospitalId) => {
	if (io) {
		let hospital = hospitalSocket.getHospitalByHospitalId(hospitalId);
		if (hospital) {
			return hospital;
		} else {
			throw new Error(`Cannot find hospital [${hospitalId}]`)
		}
	} else {
		throw new Error(`Error connecting to the hospital [${hospitalId}]`);
	}
};

const getQueueLengthPromise = (hospital) => {
	return new Promise(((resolve, reject) => {
		const socket = io.connected[hospital.socketId];
		if (socket) {
			socket.emit("getLength", (result) => {
				ql = Number(result);
				if (ql >= 0) {
					resolve({
						id: hospital.hospitalId,
						name: hospital.name,
						queueLength: ql
					});
				} else {
					reject(`Error parsing queue length result for hospital [${hospital.hospitalId}]`)
				}
			});
		} else {
			reject(`Failed to connect to hospital [${hospital.hospitalId}]`);
		}
	}));
};

const getOpenedHospitals = (callback) => {
	let promises = [];
	hospitalSocket.getOpenedHospitals().forEach((hospital) => {
		promises.push(getQueueLengthPromise(hospital));
	});

	Promise.all(promises).then((result) => {
		return callback(undefined, result);
	}, (err) => {
		return callback(err);
	});
};

const getQueueTail = (hospitalId, callback) => {
	try {
		let hospital = getHospital(hospitalId);
		io.connected[hospital.socketId].emit('peekLast', (tail) => {
			let tailElement = JSON.parse(tail);
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
};

const getQueueLength = (hospitalId, callback) => {
	try {
		let hospital = getHospital(hospitalId);
		getQueueLengthPromise(hospital).then((result) => {
			return callback(undefined, result.queueLength);
		}, (err) => {
			return callback(err);
		})

	} catch (e) {
		console.error(TAG, e.message);
		callback(e.message);
	}
};

const getQueueLengthFrom = (hospitalId, queueNumber, callback) => {
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
};

const getQueueDetails = (hospitalId, tid, callback) => {
	try {
		var hospital = getHospital(hospitalId);
		io.connected[hospital.socketId].emit('getQueueDetails', tid, (q) => {
			// console.log(q);
			var qElement = JSON.parse(q);
			if (qElement) {
				callback(undefined, qElement);
			} else {
				callback(`Error fetching details of tid ${tid} of hospital [${hospitalId}]`)
			}
		});
	} catch (e) {
		console.error(TAG, e.message);
		callback(e.message);
	}
};

module.exports = {setSocket, getOpenedHospitals, getQueueTail, getQueueLength, getQueueLengthFrom, getQueueDetails}

