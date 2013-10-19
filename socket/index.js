var express = require('express'),
	parseCookie = express.cookieParser(),
    User = require('../model/user');
	userModel = new User;

exports.connection = function (socket) {
	socket.on('disconnect', function () {
		userModel.updateToOut(socket.handshake.sessionId)
		socket.broadcast.emit('deleteUser', socket.id);
    });

	socket.on('connect', function () {
		userModel.getUser(socket.handshake.sessionId, function(user){
			if(!user){
				userModel.insertUser(socket.id, socket.handshake.sessionId, function(user){
					socket.set('name', user.name);
					socket.broadcast.emit('addNewUser', user);
					userModel.getAllUsers(function(users){
						socket.emit('addUserList', {users:users, socket:user.socket});
					});
				});				
			}else{
				if(socket.id != user.socket){
					userModel.updateUserSocket(socket.id, user.session, function(newuser){
						socket.broadcast.emit('deleteUser', user.socket);
						socket.set('name', newuser.name);
						socket.broadcast.emit('addNewUser', newuser);
						userModel.getAllUsers(function(users){
							socket.emit('addUserList', {users:users, socket:newuser.socket});
						});
					});
				}
			}
		});
	});
	socket.on('message', function (message) {
		socket.get('name', function (error, name) {
			var data = {'message':message, name:name};
			socket.broadcast.emit('message', data);
		});
	});
	socket.on('changeUserName', function (message) {
		socket.set('name', message);
		userModel.updateUserName(socket.handshake.sessionId, message, function(data){
			socket.broadcast.emit('changeUserName', data);
		});
	});
};

exports.authorization = function(handshake, callback) {
	if (handshake.headers.cookie) {
  		parseCookie(handshake, null, function(err) {
    		handshake.sessionId = handshake.cookies['connect.sid'];
  		});
  	}
  	callback(null, true);
}