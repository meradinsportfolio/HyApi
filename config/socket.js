var socketio = require('socket.io');

// information: http://socket.io/docs/
module.exports.listen = function (server) {
	var io = socketio.listen(server);

	/*
	restricting to a namespace

	var chat = io
	.of('/admin')
	.on('/connection')
	...
	...

	*/

	// for all namespaces
	io.on('connection', function (socket) {

		//socket.emit: sending data to listener

		//socket.on:   receiving data from listener
	});

	return io;
};