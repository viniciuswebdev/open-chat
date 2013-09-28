//Setup libs
var express = require('express');
var app = express()
var mongoose = require('mongoose');
var ejs = require('ejs');

//Setup configs
app.set('view enginge','ejs');
app.set('view options',{ layout:false });
app.use(express.bodyParser());

//Setup mongodb
mongoose.connect("mongodb://localhost/chat");
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var MessageSchema = new Schema({
	ref : ObjectId,
	message : String
});

var Message = mongoose.model("Message", MessageSchema);

app.get("/", function(req, resp){
	Message.find({}, function(err, rs){
		total = rs.length;
		resp.render('lista.ejs', {total:total, messages:rs })
	});
});

app.post("/new", function(req, resp){
	message = new Message();
	message.message = req.body.message;
	message.save(function(err){
		console.log(err);
	});

	resp.redirect('/');
});

app.get("/delete/:id", function(req, resp){
	Message.find({_id:req.params.id }, function(err, reg){
		reg[0].remove(function(){
			resp.redirect('/');
		});
	});
});


app.listen(2000);