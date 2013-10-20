Socket = {

	socket: {},

	addUserListListener: function () {
		this.socket.on('addUserList', function(data) {
			data.users.forEach(function(user){
				if(user.socket == data.socket){
					Users.setUserName(user.name);
					Users.addSelfUser(user.name, user.socket);
				}else{
					Users.addUser(user.name, user.socket);
				}
			});
		});
	},

	addNewUserListener: function () {
		this.socket.on('addNewUser', function(data) {
			Users.addUser(data.name, data.socket);
		});	
	},

	changeUserNameListener : function () {
		this.socket.on('changeUserName', function(data) {
			$("#" + data.socket).html('<h5 id="userNameSet" class="bold">' + data.name + '</h5>');
		});		
	},

	deleteUserListener : function () {
		this.socket.on('deleteUser', function(socket) {
			Users.deleteUser(socket);
		});	
	},

	messageListener : function () {
		this.socket.on('message', function(data) {
			Messages.addMessage(data['message'], data['name'], false);
		});	
	},

	sendMessage : function (message) {
		this.socket.emit('message', message);
	},

	changeUserName : function (userName) {
		this.socket.emit('changeUserName', userName);
	},

	init: function() {
		this.socket = io.connect();
		this.socket.emit('connect');

		this.addUserListListener();
		this.addNewUserListener();
		this.changeUserNameListener();
		this.deleteUserListener();
		this.messageListener();
	}

};