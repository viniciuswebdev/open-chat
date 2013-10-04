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
		console.log(reg.length);
		callback(reg[0]);
	});
}

exports.insertUser = insertUser;
exports.getUser = getUser;

