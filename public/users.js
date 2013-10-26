function Users () {

	this.userList = {};
	userName = {};

	this.listenUserSettings = function() {
		$(document).on('click','.userme', function(){
			$(".userme").popover(); 
		});
	};

	this.setUserName = function (userName) {
		this.userName = userName;
	};

	this.getUserName = function () {
		return this.userName;
	};

	this.listenUserChangeName = function() {
		$(document).on('keypress','#userChangeName', function(e){
			var code = (e.keyCode ? e.keyCode : e.which);
			if(code == 13) {
				$(".userme").popover('hide');
				Users.setUserName($('#userChangeName').val());
				$("#userNameSet").html(Users.getUserName());
				Socket.changeUserName(Users.getUserName());
			}
		});
	};

	this.createSelfUserDom = function (userName, socket) {
		var userNameDiv = document.createElement("div");
		userNameDiv.className = "userme";
		userNameDiv.id = socket;

		var nameTitle = document.createElement("h5");
		nameTitle.id = 'userNameSet';
		nameTitle.className = "bold";

		var name = document.createTextNode(userName);

		userNameDiv.appendChild(nameTitle);
		nameTitle.appendChild(name);

		return userNameDiv;
	};

	this.createNewUserDom = function (userName, socket) {
		var userNameDiv = document.createElement("div");
		userNameDiv.className = "user";
		userNameDiv.id = socket;

		var nameTitle = document.createElement("h5");
		nameTitle.className = "bold";

		var name = document.createTextNode(userName);

		userNameDiv.appendChild(nameTitle);
		nameTitle.appendChild(name);

		return userNameDiv;
	};

	this.addUser = function (userName, socket) {	
		$(this.createNewUserDom(userName, socket)).appendTo(this.userList).hide().fadeIn(1000);
	};

	this.deleteUser = function (socket) {
    	$("#" + socket).fadeOut(1000, function() { 
    		$(this).remove(); 
    	});
	};

	this.enableUserSettings = function() {
		$(".userme").popover({
			html:true,
		 	content: $("#userSettings").html(),
			title: "Settings"
		});
	};

	this.addSelfUser = function (userName, socket) {
		$(this.createSelfUserDom(userName, socket)).prependTo(this.userList).hide().fadeIn(1000);
		this.enableUserSettings();
	};

	this.init = function() {
		this.userList = $("#contact-list");
		this.listenUserSettings();
		this.listenUserChangeName();
	};

};