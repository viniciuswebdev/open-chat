var express = require('express'),
	parseCookie = express.cookieParser(),
    User = require('../model/user');
	userModel = new User;

exports.authorization = function(handshake, callback) {
	if (handshake.headers.cookie) {
  		parseCookie(handshake, null, function(err) {
    		handshake.sessionId = handshake.cookies['connect.sid'];
  		});
  	}
  	callback(null, true);
}