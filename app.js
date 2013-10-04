var ejs = require('ejs'),
	express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app).listen(process.env.PORT || 5000),
  io = require('socket.io').listen(server),
  parseCookie = express.cookieParser(),
  routes = require('./routes');
  socket = require('./socket');


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

io.sockets.on('connection', socket.connection);
io.set('authorization', socket.authorization);








