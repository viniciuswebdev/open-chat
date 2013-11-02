function Socket () {

	this.socket = {};

	this.addUserListListener = function () {
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
	};

	this.addNewUserListener = function () {
		this.socket.on('addNewUser', function(data) {
			Users.addUser(data.name, data.socket);
		});	
	};

	this.changeUserNameListener = function () {
		this.socket.on('changeUserName', function(data) {
			$("#" + data.socket).html('<h5 id="userNameSet" class="bold">' + data.name + '</h5>');
		});		
	};

	this.deleteUserListener = function () {
		this.socket.on('deleteUser', function(socket) {
			Users.deleteUser(socket);
		});	
	};

	this.messageListener = function () {
		this.socket.on('message', function(data) {
			Messages.addMessage(data['message'], data['name'], false);
		});	
	};

	this.sendMessage = function (message) {
		this.socket.emit('message', message);
	};

	this.changeUserName = function (userName) {
		this.socket.emit('changeUserName', userName);
	};

	this.askMessageListener = function () {
		this.socket.on('askMessages', function(socket) {
			data = {};
			data.socket = socket;
			data.messages = Storage.getItem('messages');
			this.emit('giveMessages', data);
		});	
	}

	this.getMessageListener = function () {
		this.socket.on('giveMessages', function(messages) {
			for(i in messages){
				Messages.addMessage(messages[i].name, messages[i].message);
			}
		});	
	}

	this.init = function() {
		this.socket = io.connect();
		this.socket.emit('connect');

		this.addUserListListener();
		this.addNewUserListener();
		this.changeUserNameListener();
		this.deleteUserListener();
		this.messageListener();
		this.askMessageListener();
		this.getMessageListener();
	};

};