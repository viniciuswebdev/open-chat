var express = require('express'),
	parseCookie = express.cookieParser(),
    db = require('../db');

exports.connection = function (socket) {
	socket.on('connect', function (data) {
		db.getUser(socket.handshake.sessionId, function(user){
			if(!user){
				db.insertUser(socket.id, socket.handshake.sessionId);
			}else{
				console.log(user.socket);
				console.log(user.session);
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