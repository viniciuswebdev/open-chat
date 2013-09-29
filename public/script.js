var socket = io.connect();
var UserName;

$(function() {
	setDefaultName();
	$("#setUserNameButton").click(function() {setUsetName()});
	$("#submitMessageButton").click(function() {sendMessage();});
});

function setDefaultName(){
	var defaultUserName = "User" + Math.floor((Math.random()*100)+1);
	socket.emit('setUsetName', defaultUserName);
	UserName = defaultUserName;
}

function addMessage(msg) {
	$("#entries").append('<div class="message"><p>' + UserName + ' : ' + msg + '</p></div>');
}

function sendMessage() {
	var messageInput = $('#messageInput');
	if (messageInput.val() != ""){
		socket.emit('message', messageInput.val());
		addMessage(messageInput.val(), new Date().toISOString(), true);
		messageInput.val('');
	}
}

function setUsetName() {
	var userNameInput = $("#userNameInput");
	if (userNameInput.val() != ""){
		var realUserName = userNameInput.val();
		socket.emit('setUsetName', realUserName);
		UserName = realUserName;
		$('#controll').show();
		userNameInput.hide();
		$('#setUserNameButton').hide();
	}
}

socket.on('message', function(data) {
	addMessage(data['message'], data['pseudo']);
});
