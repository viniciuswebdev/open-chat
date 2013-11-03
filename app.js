var ejs = require('ejs'),
	express = require('express'),
  app = express(),
  http = require('http'),
  server = http.createServer(app).listen(process.env.PORT || process.argv[2]),
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

io.sockets.on('connection', function (socket) {
  socket.on('disconnect', function () {
    userModel.updateToOut(socket.handshake.sessionId)
    socket.broadcast.emit('deleteUser', socket.id);
    });

  socket.on('connect', function () {
    userModel.getUser(socket.handshake.sessionId, function(user){
      connectUser(user, socket);
      askForMessages(socket);
    });
  });
  socket.on('message', function (message) {
    socket.get('name', function (error, name) {
      var data = {'message':message, name:name};
      socket.broadcast.emit('message', data);
    });
  });
  socket.on('changeUserName', function (message) {
    socket.set('name', message);
    userModel.updateUserName(socket.handshake.sessionId, message, function(data){
      socket.broadcast.emit('changeUserName', data);
    });
  });
  socket.on('giveMessages', function (data) {
    giveMessages(data.socket, data.messages);
  });
});

io.set('authorization', socket.authorization);

function connectUser(user, socket) {
  if(!user){
    userModel.insertUser(socket.id, socket.handshake.sessionId, function(user){
      socket.set('name', user.name);
      socket.broadcast.emit('addNewUser', user);
      userModel.getAllUsers(function(users){
        socket.emit('addUserList', {users:users, socket:user.socket});
      });
    });       
  }else{
    if(socket.id != user.socket){
      userModel.updateUserSocket(socket.id, user.session, function(newuser){
        socket.broadcast.emit('deleteUser', user.socket);
        socket.set('name', newuser.name);
        socket.broadcast.emit('addNewUser', newuser);
        userModel.getAllUsers(function(users){
          socket.emit('addUserList', {users:users, socket:newuser.socket});
        });
      });
    }
  }
}

function askForMessages(socket) {
    userModel.getOldestUser(function(user){
      if(user){
        io.sockets.socket(user.socket).emit("askMessages", socket.id);
      }
    });
}

function giveMessages(socket, messages) {  
  console.log('s');
  io.sockets.socket(socket).emit("giveMessages", messages);
}




