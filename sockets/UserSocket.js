class Users {
	constructor () {
		this.users = [];
	}

	addUser(socketId, userId) {
		var user = {socketId, userId};
		this.users.push(user);
		return user;
	}

	removeUser (socketId) {
		var user = this.getUserBySocketId(socketId);
		if (user) {
			this.users = this.users.filter((user) => user.socketId !== socketId);
		}
		return user;
	}

	getUserBySocketId(socketId) {
		return this.users.filter((user) => user.socketId === socketId)[0];
	}

	getUserByUserId(userId) {
		return this.users.filter((user) => user.userId === userId)[0];
	}

}

var users = new Users();
var connect = (io) => {
	io.on('connection', (socket) => {
  		socket.on('handshake', (userDetails, callback) => {
  			users.removeUser(socket.id);
			users.addUser(socket.id, userDetails.userId);
			console.log(`User [${userDetails.userId}] is connected`);
		});

		socket.on('disconnect', () => {
			var user = users.removeUser(socket.id);
			console.log(`User [${userDetails.userId}] is disconnected`);
		});
	});
}
