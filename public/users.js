Users = {

	userList : {},
	userName: {},

	listenUserSettings: function() {
		$(document).on('click','.userme', function(){
			$(".userme").popover(); 
		});
	},

	setUserName: function (userName) {
		this.userName = userName;
	},

	getUserName: function () {
		return this.userName;
	},

	listenUserChangeName: function() {
		$(document).on('keypress','#userChangeName', function(e){
			var code = (e.keyCode ? e.keyCode : e.which);
			if(code == 13) {
				$(".userme").popover('hide');
				Users.setUserName($('#userChangeName').val());
				$("#userNameSet").html(Users.getUserName());
				Socket.changeUserName(Users.getUserName());
			}
		});
	},

	createSelfUserDom: function (userName, socket) {
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
	},

	createNewUserDom: function (userName, socket) {
		var userNameDiv = document.createElement("div");
		userNameDiv.className = "user";
		userNameDiv.id = socket;

		var nameTitle = document.createElement("h5");
		nameTitle.className = "bold";

		var name = document.createTextNode(userName);

		userNameDiv.appendChild(nameTitle);
		nameTitle.appendChild(name);

		return userNameDiv;
	},

	addUser: function (userName, socket) {	
		$(this.createNewUserDom(userName, socket)).appendTo(this.userList).hide().fadeIn(1000);
	},

	deleteUser: function (socket) {
    	$("#" + socket).fadeOut(1000, function() { 
    		$(this).remove(); 
    	});
	},

	enableUserSettings: function() {
		$(".userme").popover({
			html:true,
		 	content: $("#userSettings").html(),
			title: "Settings"
		});
	},

	addSelfUser: function (userName, socket) {
		$(this.createSelfUserDom(userName, socket)).prependTo(this.userList).hide().fadeIn(1000);
		this.enableUserSettings();
	},

	init: function() {
		this.userList = $("#contact-list");
		this.listenUserSettings();
		this.listenUserChangeName();
	}

};