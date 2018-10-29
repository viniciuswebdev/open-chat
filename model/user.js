var mongoose = require('mongoose');
var Schema = mongoose.Schema;
	
mongoose.connect("mongodb://localhost/chat");
var ObjectId = Schema.ObjectId;
var UsersSchema = new Schema({ ref:ObjectId, updated_at:Date, name:String, socket:String, session:String, status:String });
var User = mongoose.model("User", UsersSchema);

UsersSchema.pre('save', function(next){
  this.updated_at = new Date;
  next();
});

module.exports = User;

User.prototype.insertUser = function(socket, session, callback){
	var user = new User();
	user.socket = socket;
	user.session = session;
	user.name = "User" + Math.floor((Math.random()*100)+1);
	user.status = "in";
	user.save(function(){
		callback(user);
	});
};

User.prototype.getOldestUser = function (callback) {
	User.findOne({}, {}, { sort: { 'updated_at' : 1 } }, function(err, reg) {
		callback(reg);
	});
}

User.prototype.getUser = function(session, callback){
	User.find({session : session}, function(err, reg){
		callback(reg[0]);
	});
}

User.prototype.updateUserSocket = function(socket, session, callback){
	User.find({session : session}, function(err, reg){
		var user = reg[0];
		user.socket = socket;
		user.status = "in";
		user.save(function(){
			callback(user);
		});
	});
}

User.prototype.updateUserName = function(session, name, callback){
	User.find({session : session}, function(err, reg){
		var user = reg[0];
		user.name = name;
		user.save(function(){
			callback(user);
		});
	});
}

User.prototype.updateToOut = function(session){
	User.find({session : session}, function(err, reg){
		var user = reg[0];
		user.status = 'out';
		user.save();
	});
}

User.prototype.getAllUsers = function(callback){
	User.find({status:"in"}, function(err, reg){
		callback(reg);
	});
}
