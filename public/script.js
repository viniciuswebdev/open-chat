var socket = io.connect();
var UserName;


$(function() {

	Users.init();
	Messages.init();
	connectUser();
	
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
	Messages.addMessage(data['message'], data['name'], false);
});