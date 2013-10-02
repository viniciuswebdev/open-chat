var mongoose = require('mongoose'),
	ejs = require('ejs'),
	express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app).listen(process.env.PORT || 5000),
    io = require('socket.io').listen(server),
    parseCookie = express.cookieParser(),
    store = require('dirty')('my.db');

app.configure(function () {
  	app.use(parseCookie);
    app.use(express.session({secret: 'secret', key: 'connect.sid'}));
	app.set('view enginge','ejs');
	app.set('view options',{ layout:false });
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public'));
});

app.get("/", function(req, resp){
	resp.render('home.ejs')		
});

app.get("/:room", function(req, resp){
	resp.render('chat.ejs')		
});

io.sockets.on('connection', function (socket) {
	store.forEach(function(key, val) {
		if(socket.handshake.sessionID != key){
			socket.emit('adduser', val);
		}
    });

	socket.on('setUserName', function (data) {
		var existingUserName = store.get(socket.handshake.sessionID); 
		if(existingUserName){
			socket.set('pseudo', existingUserName);
			socket.emit('user', existingUserName);
		}else{
			store.set(socket.handshake.sessionID, data);		
			socket.set('pseudo', data);
			socket.emit('user', data);
			socket.broadcast.emit('adduser', data);
		}
	});
	socket.on('message', function (message) {
		socket.get('pseudo', function (error, name) {
			var data = { 'message' : message, pseudo : name };
			socket.broadcast.emit('message', data);
		})
	});
});

io.set('authorization', function(handshake, callback) {
	if (handshake.headers.cookie) {
  		parseCookie(handshake, null, function(err) {
    		handshake.sessionID = handshake.cookies['connect.sid'];
  		});
  	}
  	callback(null, true);
});









