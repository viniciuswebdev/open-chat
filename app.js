var mongoose = require('mongoose'),
	ejs = require('ejs'),
	express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app).listen(process.env.PORT || 5000),
  io = require('socket.io').listen(server),
  parseCookie = express.cookieParser(),
  routes = require('./routes');

app.configure(function () {
	app.use(parseCookie);
  app.use(express.session({secret: 'secret', key: 'connect.sid'}));
	app.set('view enginge','ejs');
	app.set('view options',{ layout:false });
	app.use(express.bodyParser());
	app.use(express.static(__dirname + '/public'));
});

app.get("/", routes.index);
app.get("/:room", routes.chat);

io.sockets.on('connection', function (socket) {
mongoose.connect("mongodb://localhost/chat");
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  var MessageSchema = new Schema({
    ref : ObjectId,
    message : String
  });

  var Message = mongoose.model("Message", MessageSchema);
});

io.set('authorization', function(handshake, callback) {
	if (handshake.headers.cookie) {
  		parseCookie(handshake, null, function(err) {
    		handshake.sessionID = handshake.cookies['connect.sid'];
  		});
  	}
  	callback(null, true);
});









