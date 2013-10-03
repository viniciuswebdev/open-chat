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

});

io.set('authorization', function(handshake, callback) {
	if (handshake.headers.cookie) {
  		parseCookie(handshake, null, function(err) {
    		handshake.sessionID = handshake.cookies['connect.sid'];
  		});
  	}
  	callback(null, true);
});









