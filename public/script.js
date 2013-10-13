var socket = io.connect();
var UserName;

$(function() {
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
			addUser(user.name, user.socket, true);
		}else{
			addUser(user.name, user.socket, false);
		}
	});
});

socket.on('addNewUser', function(data) {
	addUser(data.name, data.socket);
});

socket.on('deleteUser', function(socket) {
	deleteUser(socket);
});

socket.on('message', function(data) {
	addMessage(data['message'], data['name'], false);
});

function addUser(user, socket, me) {	
	selfUserClass = (me) ? "me" : "";
	$('<div id="' + socket +'" class="user' + selfUserClass + '"><h4>' + user + '</h4></div>').appendTo("#contact-list").hide().fadeIn(1000);
}

function deleteUser(socket) {
    $("#" + socket).fadeOut(1000, function() { 
    	$(this).remove(); 
    });
}

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
