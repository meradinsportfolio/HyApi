var socketio = require('socket.io');

// information: http://socket.io/docs/
module.exports.listen = function (server) {
	var io = socketio.listen(server);

	// for all namespaces
	io.on('connection', function (socket) {
		console.log('SERVER:: server accepts connection');
		roomJoined = false;

		socket.on('connectChat', function (roomName, username) {
			console.log('SERVER:: trying to join room: ' + roomName);
			if (roomJoined) return;

			socket.join(roomName);
			roomJoined = true;

			socket.broadcast.to(roomName).emit('joinedChat', { username: username });
		});

		socket.on('disconnect', function (roomName) {

			io.to(roomName).emit('leftChat', { username: 'admin' });
		});

		socket.on('sendMessage', function (roomName, username, message) {

			socket.broadcast.to(roomName).emit('receiveMessage', { username: username, message: message });
		});

	});

	return io;
};