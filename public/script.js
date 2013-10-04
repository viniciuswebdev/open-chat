var socket = io.connect();
var UserName;

$(function() {
	connectUser();

	$("#userNameArea").hide();
	$("#setUserNameButton").click(function() {setUserName()});
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
		}
		addUser(user.name, user.socket);
	});
});

socket.on('addNewUser', function(data) {
	addUser(data.name, data.socket);
});

socket.on('deleteUser', function(socket) {
	deleteUser(socket);
});

socket.on('message', function(data) {
	addMessage(data['message'], data['name']);
});

function addSelfUser(user, socket) {
	UserName = user;
	$('<div id="' + socket +'" class="user"><h4>' + user + '</h4></div>').appendTo("#contact-list").hide().fadeIn(1000);
}

function addUser(user, socket) {
	$('<div id="' + socket +'" class="user"><h4>' + user + '</h4></div>').appendTo("#contact-list").hide().fadeIn(1000);
}

function deleteUser(socket) {
    $("#" + socket).fadeOut(1000, function() { 
    	$(this).remove(); 
    });
}

function addMessage(msg, pseudo) {
	var entries = $("#entries");
	entries.append('<div class="message">' + '<p class="text">'  + pseudo + ' : ' + msg + '</p></div>');
	entries.scrollTop(entries[0].scrollHeight);
}

function sendMessage() {
	var messageInput = $('#messageInput');
	if (messageInput.val() != ""){
		socket.emit('message', messageInput.val());
		addMessage(messageInput.val(), UserName, new Date().toISOString(), true);
		messageInput.val('');
	}
}
