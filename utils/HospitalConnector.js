class Hospitals {
	constructor() {
		this.hospitals = [];
	}

	addHospital(socketId, hospitalId, name) {
		var hospital = {socketId, hospitalId, name};
		this.hospitals.push(hospital);
		return hospital;
	}

	getHospitalByHospitalId (hospitalId) {
		return this.hospitals.filter((hospital) => hospital.hospitalId === hospitalId)[0];
	}

	getHospitalBySocketId (socketId) {
		return this.hospitals.filter((hospital) => hospital.socketId === socketId)[0];
	}

	removeHospital (socketId) {
		var hospital = this.getHospitalBySocketId(socketId);
		if (hospital) {
			this.hospitals = this.hospitals.filter((hospital) => hospital.socketId !== socketId);
		}
		return hospital;
	}
}

var hospitals = new Hospitals();
var connect = (io) => {
	io.on('connection', (socket) => {
  		socket.on('handshake', (hospitalDetails, callback) => {
  			hospitals.removeHospital(socket.id);
			hospitals.addHospital(socket.id, hospitalDetails.hospitalId, hospitalDetails.name);
			console.log(`${hospitalDetails.name} [${hospitalDetails.hospitalId}] is connected`);
		});

		socket.on('disconnect', () => {
			var hospital = hospitals.removeHospital(socket.id);
			console.log(`${hospital.name} [${hospital.hospitalId}] is disconnected`);
		});
	});
}

module.exports = {connect, hospitals}

