var socket = io.connect();
var UserName;

$(function() {
	setDefaultName();
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

function setDefaultName(){
	var defaultUserName = "User" + Math.floor((Math.random()*100)+1);
	socket.emit('setUserName', defaultUserName);
}

function addMessage(msg, pseudo) {
	var entries = $("#entries");
	entries.append('<div class="message">' + '<p class="text">'  + pseudo + ' : ' + msg + '</p></div>');
	entries.scrollTop(entries[0].scrollHeight);
}

function addUser(user) {
	$("#contact-list").append('<h4>' + user + '</h4>');
}

function sendMessage() {
	var messageInput = $('#messageInput');
	if (messageInput.val() != ""){
		socket.emit('message', messageInput.val());
		addMessage(messageInput.val(), UserName,new Date().toISOString(), true);
		messageInput.val('');
	}
}

function setUserName() {
	var userNameInput = $("#userNameInput");
	if (userNameInput.val() != ""){
		var realUserName = userNameInput.val();
		socket.emit('setUserName', realUserName);
		UserName = realUserName;
		$('#controll').show();
		userNameInput.hide();
		$('#setUserNameButton').hide();
	}
}

socket.on('user', function(data) {
	addUser(data);
});

socket.on('message', function(data) {
	addMessage(data['message'], data['pseudo']);
});