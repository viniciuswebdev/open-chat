//Setup libs
var mongoose = require('mongoose');
var ejs = require('ejs');

var express = require('express'),
    app = express()
  , http = require('http')
  , server = http.createServer(app).listen(3000)
  , io = require('socket.io').listen(server);

//Setup configs

app.set('view enginge','ejs');
app.set('view options',{ layout:false });
app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

//Setup mongodb
/*
mongoose.connect("mongodb://localhost/chat");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
	ref : ObjectId,
	message : String
});

var Message = mongoose.model("Message", MessageSchema);
*/


io.sockets.on('connection', function (socket) {
	socket.join('room1');
	socket.on('setUsetName', function (data) {
		socket.set('pseudo', data);
	});
	socket.on('message', function (message) {
		socket.get('pseudo', function (error, name) {
			var data = { 'message' : message, pseudo : name };
			socket.broadcast.to('room1').emit('message', data);
			console.log("user " + name + " send this : " + message);
		})
	});
});

app.get("/", function(req, resp){
	resp.render('home.ejs')		
});

app.get("/:room", function(req, resp){
	resp.render('chat.ejs')		
});