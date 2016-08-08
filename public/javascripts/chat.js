var socket;
console.log('asdasd');
ioConnect();
function ioConnect() {
	$(document).ready(function () { 
		socket = io.connect('http://localhost:3000');
		console.log('CLIENT:: client trying to connect');
		var username = 'admin';
		var roomName = 'admin';
		connectChat(roomName, username);

		$('#inputBtn').click(function () {
			console.log('message sent');
			var message = $("#inputMessage").val();

			// $('#chatMessageContainer').append += "<li class='messageSent'>" 
			// 										+ "<p class='username'>User: " + username + "</p>" 
			// 										+ "<p class='message'>" + message + "</p>" 
			// 									+ "</li>";
			$('#chatMessageContainer').append("<li class='messageSent'>" 
													+ "<p class='message'>" 
														+ "<span class='user'>User: " + username + "</span>"
														+ "<span class='message'>" + message + "</span>"
													+ "</p>" 
												+ "</li>");

			$("#inputMessage").val('');
			
			socket.emit('sendMessage', roomName, username, message);
		});
		socket.on('receiveMessage', function (data) {
			$('#chatMessageContainer').append("<li class='messageReceived'>" 
													+ "<p class='message'>" 
														+ "<span class='username'>User: " + data.username + "</span>"
														+ "<span class='message'>" + data.message + "</span>"
													+ "</p>" 
												+ "</li>");
		});

		socket.on('joinedChat', function (data) {
			$('#chatMessageContainer').append("<li class='messageJoinedChat'>" 
													+ "<p class='message'>"
														+ "<span class='userJoin'>User: " + data.username + " has joined the chat.</span>"
													+"</p>" 
												+ "</li>");
		});

		socket.on('leftChat', function (data) {
			$('#chatMessageContainer').append("<li class='messageLeftChat'>" 
													+ "<p class='message'>"
														+ "<span class='userLeft'>User: " + data.username + " has left the chat.</span>"
													+"</p>" 
												+ "</li>");
		});

	});
}

function ioDisconnect () {
	socket.emit('disconnect', 'admin');
}
	
function connectChat (room, username) {
	socket.emit('connectChat', room, username);
}