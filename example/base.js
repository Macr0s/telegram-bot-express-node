var telegrambot = require("../index.js").client;


var client = new telegrambot("119706451:AAEcJZxveIj7rsUwqKCmDkCt0VWgEZsUfMU", 80);

client.on("message", function (data){
	console.log(data);
	client.sendMessage({
		chat_id: data.message.chat.id,
		text: "ciao"
	}, function (err,data){
	console.log(data);
})
});

client.setWebHooks("https://feedthebeast.ml", function (err,data){
	console.log(data);
})

client.createServer(function (){});