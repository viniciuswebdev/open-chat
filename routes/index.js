exports.index = function(req, resp){
	resp.redirect('/room')		
};

exports.chat = function(req, resp){
	resp.render('chat.ejs')
};