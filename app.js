var mongoose = require('mongoose');
var ejs = require('ejs');

var express = require('express'),
    app = express()
  , http = require('http')
  , server = http.createServer(app).listen(process.env.PORT || 5000)
  , io = require('socket.io').listen(server);

app.set('view enginge','ejs');
app.set('view options',{ layout:false });
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, resp){
	resp.render('home.ejs')		
});

app.get("/:room", function(req, resp){
	resp.render('chat.ejs')		
});

var onlineUsers = new Array();
io.sockets.on('connection', function (socket) {
	socket.join('room1');
	socket.on('setUserName', function (data) {
		socket.set('pseudo', data);
		socket.broadcast.to('room1').emit('user', data);
	});
	socket.on('message', function (message) {
		socket.get('pseudo', function (error, name) {
			var data = { 'message' : message, pseudo : name };
			socket.broadcast.to('room1').emit('message', data);
			console.log("user " + name + " send this : " + message);
		})
	});
});