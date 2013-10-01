var mongoose = require('mongoose'),
	ejs = require('ejs'),
	express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app).listen(process.env.PORT || 5000),
    io = require('socket.io').listen(server),
    parseCookie = express.cookieParser();

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

io.sockets.on('connection', function (socket) {
	socket.join('room1');
	socket.on('setUserName', function (data) {
		socket.set('pseudo', data);
		io.sockets.in('room1').emit('user', data);
	});
	socket.on('message', function (message) {
		socket.get('pseudo', function (error, name) {
			var data = { 'message' : message, pseudo : name };
			socket.broadcast.to('room1').emit('message', data);
		})
	});
});

io.set('authorization', function(handshake, callback) {
	if (handshake.headers.cookie) {
  		parseCookie(handshake, null, function(err) {
    		handshake.sessionID = handshake.cookies['connect.sid'];
    		console.log(handshake.sessionID);
  		});
  	}
  	callback(null, true);
});









