var mysql = require('mysql');
var client = mysql.createConnection({
	user: 'root',
	password: 'abc123',
	database: 'chat',
});

client.query('INSERT INTO message (message) VALUES (?)', ['message'], function(err, info){
	console.log(err);	
	console.log(info.insertId);
});

client.query('DELETE FROM message WHERE id = ?', [1], function(err, info){
	console.log(err);
});

client.query('UPDATE message SET message = ? WHERE id = ?', ['other message', 5], function(err, info){
	console.log(err);
});

client.query('SELECT * FROM message', function(err, result){
	result.forEach(function(result){
		console.log('id: ' + result.id + ' - message: ' + result.message);
	});
	client.end();
});