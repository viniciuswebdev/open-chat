var socket = io.connect();
var UserName;

$(function() {
	setFakeName();
	$("#nameSet").click(function() {setUsetName()});
	$("#submit").click(function() {sentMessage();});
});

function setFakeName(){
	var fakeUserName = "User" + Math.floor((Math.random()*100)+1);
	socket.emit('setUsetName', fakeUserName);
	UserName = fakeUserName;
}

function addMessage(msg, pseudo) {
	$("#entries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
}

function sentMessage() {
	if ($('#messageInput').val() != "") 
	{
		socket.emit('message', $('#messageInput').val());
		addMessage($('#messageInput').val(), UserName, new Date().toISOString(), true);
		$('#messageInput').val('');
	}
}

function setUsetName() {
	if ($("#pseudoInput").val() != "")
	{
		var realUserName = $("#pseudoInput").val();
		socket.emit('setUsetName', realUserName);
		UserName = realUserName;
		$('#controll').show();
		$('#pseudoInput').hide();
		$('#nameSet').hide();
	}
}

socket.on('message', function(data) {
	addMessage(data['message'], data['pseudo']);
});
