var socket = io.connect();
function addMessage(msg, pseudo) {
	$("#entries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
}
function sentMessage() {
	if ($('#messageInput').val() != "") 
	{
		socket.emit('message', $('#messageInput').val());
		addMessage($('#messageInput').val(), "Me", new Date().toISOString(), true);
		$('#messageInput').val('');
	}
}
function setUsetName() {
	if ($("#pseudoInput").val() != "")
	{
		socket.emit('setUsetName', $("#pseudoInput").val());
		$('#controll').show();
		$('#pseudoInput').hide();
		$('#nameSet').hide();
	}
}
socket.on('message', function(data) {
	addMessage(data['message'], data['pseudo']);
});
$(function() {
	$("#controll").hide();
	$("#nameSet").click(function() {setUsetName()});
	$("#submit").click(function() {sentMessage();});
});