var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
mongoose.connect("mongodb://localhost/chat");
var ObjectId = Schema.ObjectId;
var UsersSchema = new Schema({ ref : ObjectId, socket : String, session : String });
var User = mongoose.model("User", UsersSchema);

mongoose.connection.db.dropDatabase();

var insertUser = function(socket, session){
	var user = new User();
	user.socket = socket;
	user.session = session;
	user.save();
};

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

exports.insertUser = insertUser;
exports.getUser = getUser;
exports.updateUserSocket = updateUserSocket;


