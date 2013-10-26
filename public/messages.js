function Messages () {

	this.sendMessageListener = function () {
		$("#messageInput").keypress(function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if(code == 13) {
				e.preventDefault()
				Messages.sendMessage($('#messageInput'));
			}
		});
	};

	this.createMessageDom = function (message, userName, self) {		
		var messageDiv = document.createElement("div");
		style = (self) ? 'message self' : 'message';
		messageDiv.className = style;

		var messageText = document.createElement("p");
		messageText.className = "text";

		var text = document.createTextNode(userName + ' : ' + message);

		messageDiv.appendChild(messageText);
		messageText.appendChild(text);

		return messageDiv;
	};

	this.addMessage = function (message, userName, self) {
		var entries = $("#entries");
		entries.append(this.createMessageDom(message, userName, self));
		entries.scrollTop(entries[0].scrollHeight);
	};

	this.sendMessage = function (message) {
		var messageInput = message;
		if (messageInput.val() != ""){
			Socket.sendMessage(messageInput.val());
			Messages.addMessage(messageInput.val(), Users.getUserName(), true);
			messageInput.val('');
		}
	};

	this.init = function(){
		this.sendMessageListener();
	};

};