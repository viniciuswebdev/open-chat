var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
mongoose.connect("mongodb://localhost/chat");
var ObjectId = Schema.ObjectId;
var UsersSchema = new Schema({ ref : ObjectId, socket : String, session : String });
var User = mongoose.model("User", UsersSchema);

var insertUser = function(socket, session, callback){
	var user = new User();
	user.socket = socket;
	user.session = session;
	user.save(function(){
		callback(user);
	});
};

var deleteUser = function(socket){
	User.find({socket : socket}, function(err, reg){
		reg[0].remove();
	});
}

var getUser = function(session, callback){
	User.find({session : session}, function(err, reg){
		callback(reg[0]);
	});
}

var updateUserSocket = function(socket, session, callback){
	User.find({session : session}, function(err, reg){
		var user = reg[0];
		user.socket = socket;
		user.save();
		callback(user);
	});
}

var getAllUsers = function(callback){
	User.find({}, function(err, reg){
		callback(reg);
	});
}

exports.insertUser = insertUser;
exports.getUser = getUser;
exports.updateUserSocket = updateUserSocket;
exports.getAllUsers = getAllUsers;
exports.deleteUser = deleteUser;




