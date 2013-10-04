var express = require('express'),
	parseCookie = express.cookieParser(),
    db = require('../db');

exports.connection = function (socket) {
	socket.on('disconnect', function () {
		db.deleteUser(socket.id)
		socket.broadcast.emit('deleteUser', socket.id);
    });

	socket.on('connect', function (data) {
		db.getUser(socket.handshake.sessionId, function(user){
			if(!user){
				db.insertUser(socket.id, socket.handshake.sessionId, function(user){
					socket.broadcast.emit('addNewUser', user);
					db.getAllUsers(function(data){
						socket.emit('addUserList', data);
					});
				});				
			}else{
				if(socket.id != user.socket){
					db.updateUserSocket(socket.id, user.session, function(user){
						socket.broadcast.emit('addNewUser', user);
						db.getAllUsers(function(data){
							socket.emit('addUserList', data);
						});
					});
				}
			}
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