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

		/*
		let the listener join a group
		socket.join('name');
		
		let the listener leave a group
		socket.leave('name');

		socket.emit: sending data to listener
		socket.emit('name', { dataname : data});

		emit to specific room
		io.to('roomname').emit('name');


		socket.on:   receiving data from listener
		socket.on('name', function () {
			...
		});





		*/

	});

	/*
	client side:
	add:
	<script src="socket.io/socket.io.js"></script>
	<script src="http://code.jquery.com/jquery-latest.min.js"></script>
	
	<script>
		create a new websocket, let it listen from the port set in www
		var socket = io('http://localhost:3000');

		same sort of emit's and on's as defined above.
		add the necessary js needed in te emit's and on's when called.
	
		</script>

	*/

	return io;
};