var userList = [];

function addUser(socketId, userId) {
	var user = {socketId, userId};
	userList.push(user);
	return user;
}

function removeUser (socketId) {
	var user = getUserBySocketId(socketId);
	if (user) {
		userList = userList.filter((user) => user.socketId !== socketId);
	}
	return user;
}

function getUserBySocketId(socketId) {
	return userList.filter((user) => user.socketId === socketId)[0];
}

function getUserByUserId(userId) {
	return userList.filter((user) => user.userId === userId)[0];
}

var connect = (io) => {
	io.use((socket, next) => {
		let userId = socket.handshake.query.userId;
		let user = getUserByUserId(userId);
		if (user) {
			let index = userList.findIndex((user) => user.userId === userId)
			userList[index].socketId = socket.id;
			console.log(`User ${userId} is reconnected`);
		} else {
			addUser(socket.id, userId, name);
			console.log(`User ${userId} is connected`);
		}
		next();
	});

	io.on('connection', (socket) => {
		socket.on('disconnect', () => {
			var user = removeUser(socket.id);
			console.log(`User [${userDetails.userId}] is disconnected`);
		});
	});
}

module.exports = {connect, getUserByUserId}
