exports.index = function(req, resp){
	resp.render('home.ejs')		
};

exports.chat = function(req, resp){
	resp.render('chat.ejs')
};