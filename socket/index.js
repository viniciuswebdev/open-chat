var express = require('express'),
	parseCookie = express.cookieParser(),
    db = require('../db');

exports.connection = function (socket) {
	socket.on('disconnect', function () {
		db.updateToOut(socket.handshake.sessionId)
		socket.broadcast.emit('deleteUser', socket.id);
    });

	socket.on('connect', function () {
		db.getUser(socket.handshake.sessionId, function(user){
			if(!user){
				db.insertUser(socket.id, socket.handshake.sessionId, function(user){
					socket.set('name', user.name);
					socket.broadcast.emit('addNewUser', user);
					db.getAllUsers(function(users){
						socket.emit('addUserList', {users:users, socket:user.socket});
					});
				});				
			}else{
				if(socket.id != user.socket){
					db.updateUserSocket(socket.id, user.session, function(newuser){
						socket.broadcast.emit('deleteUser', user.socket);
						socket.set('name', newuser.name);
						socket.broadcast.emit('addNewUser', newuser);
						db.getAllUsers(function(users){
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
};

exports.authorization = function(handshake, callback) {
	if (handshake.headers.cookie) {
  		parseCookie(handshake, null, function(err) {
    		handshake.sessionId = handshake.cookies['connect.sid'];
  		});
  	}
  	callback(null, true);
}