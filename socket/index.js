var express = require('express'),
	parseCookie = express.cookieParser(),
    db = require('../db');

exports.connection = function (socket) {
	socket.on('connect', function (data) {
		db.getUser(socket.handshake.sessionId, function(user){
			if(!user){
				db.insertUser(socket.id, socket.handshake.sessionId);
			}else{
				if(socket.id != user.socket){
					db.updateUserSocket(socket.id, user.session, function(user){
						console.log(socket.id);
						console.log(user.socket);
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