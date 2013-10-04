var express = require('express'),
	parseCookie = express.cookieParser();

exports.connection = function (socket) {
  
};

exports.authorization = function(handshake, callback) {
	if (handshake.headers.cookie) {
  		parseCookie(handshake, null, function(err) {
    		handshake.sessionID = handshake.cookies['connect.sid'];
    		console.log(handshake.sessionID);
  		});
  	}
  	callback(null, true);
}