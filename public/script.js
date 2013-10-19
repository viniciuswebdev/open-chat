var socket = io.connect();
var UserName;

$(function() {
	$(document).on('click','.userme', function(){
		$(".userme").popover(); 
	});
	$(document).on('keypress','#userChangeName', function(e){
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) {
			$(".userme").popover('hide');
			var userName = $('#userChangeName').val();
			UserName = userName;
			$("#userNameSet").html(UserName);
			socket.emit('changeUserName', UserName);
		}
	});
	$("body").on("elementCreated", function(event){
    	$(".userme").popover({
			html:true,
		 	content: $("#userSettings").html(),
			title: "Settings"
		});
    });
	connectUser();
	$("#messageInput").keypress(function(e) {
		var code = (e.keyCode ? e.keyCode : e.which);
		if(code == 13) {
			e.preventDefault()
			sendMessage();
		}
	});
});

function connectUser(){
	socket.emit('connect');
}

socket.on('addUserList', function(data) {
	data.users.forEach(function(user){
		if(user.socket == data.socket){
			UserName = user.name;
			addSelfUser(user.name, user.socket);
		}else{
			addUser(user.name, user.socket);
		}
	});
});

socket.on('addNewUser', function(data) {
	addUser(data.name, data.socket);
});

socket.on('changeUserName', function(data) {
	$("#" + data.socket).html('<h5 id="userNameSet" class="bold">' + data.name + '</h5>');
});

socket.on('deleteUser', function(socket) {
	deleteUser(socket);
});

socket.on('message', function(data) {
	addMessage(data['message'], data['name'], false);
});

function addSelfUser(user, socket) {
	$('<div id="' + socket +'" class="userme"><h5 id="userNameSet" class="bold">' + user + '</h5><div class="settings"></div></div>').prependTo("#contact-list").hide().fadeIn(1000);
	$( 'body' ).trigger( 'elementCreated' );
}

function addUser(user, socket) {	
	$('<div id="' + socket +'" class="user"><h5 class="bold">' + user + '</h5></div>').appendTo("#contact-list").hide().fadeIn(1000);
}

function deleteUser(socket) {
    $("#" + socket).fadeOut(1000, function() { 
    	$(this).remove(); 
    });
}

function addMessage(msg, pseudo, self) {
	var entries = $("#entries");
	selfStyle = (self) ? 'self' : '';
	entries.append('<div class="message ' + selfStyle + '">' + '<p class="text">'  + pseudo + ' : ' + msg + '</p></div>');
	entries.scrollTop(entries[0].scrollHeight);
}

function sendMessage() {
	var messageInput = $('#messageInput');
	if (messageInput.val() != ""){
		socket.emit('message', messageInput.val());
		addMessage(messageInput.val(), UserName, true);
		messageInput.val('');
	}
}
