var socket = io.connect();
var UserName;


$(function() {

	Users.init();

	connectUser();
	$("#messageInput").keypress(function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) {
			e.preventDefault()
			sendMessage();
		}
	});
});

function connectUser(){
	socket.emit('connect');
}

socket.on('addUserList', function(data) {
	data.users.forEach(function(user){
		if(user.socket == data.socket){
			UserName = user.name;
			Users.addSelfUser(user.name, user.socket);
		}else{
			Users.addUser(user.name, user.socket);
		}
	});
});

socket.on('addNewUser', function(data) {
	Users.addUser(data.name, data.socket);
});

socket.on('changeUserName', function(data) {
	$("#" + data.socket).html('<h5 id="userNameSet" class="bold">' + data.name + '</h5>');
});

socket.on('deleteUser', function(socket) {
	Users.deleteUser(socket);
});

socket.on('message', function(data) {
	addMessage(data['message'], data['name'], false);
});


function addMessage(msg, pseudo, self) {
	var entries = $("#entries");
	selfStyle = (self) ? 'self' : '';
	entries.append('<div class="message ' + selfStyle + '">' + '<p class="text">'  + pseudo + ' : ' + msg + '</p></div>');
	entries.scrollTop(entries[0].scrollHeight);
}

function sendMessage() {
	var messageInput = $('#messageInput');
	if (messageInput.val() != ""){
		socket.emit('message', messageInput.val());
		addMessage(messageInput.val(), UserName, true);
		messageInput.val('');
	}
}
