Messages = {

	sendMessageListener: function () {
		$("#messageInput").keypress(function(e) {
			var code = (e.keyCode ? e.keyCode : e.which);
			if(code == 13) {
				e.preventDefault()
				Messages.sendMessage($('#messageInput'));
			}
		});
	},

	createMessageDom: function (message, userName, self) {		
		var messageDiv = document.createElement("div");
		style = (self) ? 'message self' : 'message';
		messageDiv.className = style;

		var messageText = document.createElement("p");
		messageText.className = "text";

		var text = document.createTextNode(userName + ' : ' + message);

		messageDiv.appendChild(messageText);
		messageText.appendChild(text);

		return messageDiv;
	},

	addMessage: function (message, userName, self) {
		var entries = $("#entries");
		entries.append(this.createMessageDom(message, userName, self));
		entries.scrollTop(entries[0].scrollHeight);
	},

	sendMessage: function (message) {
		var messageInput = message;
		if (messageInput.val() != ""){
			Socket.sendMessage(messageInput.val());
			Messages.addMessage(messageInput.val(), Users.getUserName(), true);
			messageInput.val('');
		}
	},

	init: function(){
		this.sendMessageListener();
	}

};