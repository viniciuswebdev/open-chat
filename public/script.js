var socket = io.connect();
var UserName;

$(function() {
	setDefaultName();
	$("#userNameArea").hide();
	$("#setUserNameButton").click(function() {setUsetName()});
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
	socket.emit('setUsetName', defaultUserName);
	UserName = defaultUserName;
}

function addMessage(msg) {
	var entries = $("#entries");
	entries.append('<div class="message">' + '<p class="text">'  + UserName + ' : ' + msg + '</p></div>');
	entries.scrollTop(entries[0].scrollHeight);
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
