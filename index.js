var body = require("body-parser"),
async = require("async"),
request = require("request"),
express = require("express"),
util = require('util'),
EventEmitter = require('events').EventEmitter,
extend = require("extend");

function TelegramBot(api, port){
	if (typeof port == "number"){
		app = express();
		this.port = port;
	}
	this.app = app
	
	this.apikey = api;
	this.baseurl = "https://api.telegram.org/bot"+api+"/";

	this.app.use(body.json());
	this.app.use(body.urlencoded({ extended: true }));

	var self = this;

	this.app.use(function (req, res, next){
		self.emit("message", req.body);
		res.write("ok");
		res.end();

		self.detectMessage(req.body);
	});
}

util.inherits(TelegramBot, EventEmitter);

TelegramBot.prototype._prepare = function (data, merged){

	EventEmitter.call(this);

	var result = {};

	result.message_id = data.message_id;
	result.from = data.from;
	result.date = data.date;
	result.chat = data.chat;

	if (typeof data.forward_from != "undefined")
		result.forward_from = data.forward_from

	if (typeof data.forward_data != "undefined")
		result.forward_data = data.forward_data

	if (typeof data.reply_to_message != "undefined")
		result.reply_to_message = data.reply_to_message

	extend(false, result, merged);

	return result;
}

TelegramBot.prototype.detectMessage = function (data){
	if (typeof data.text != "undefined"){
		this.emit("message_text", this._prepare(data, {
			body: data.text
		}));
	}else if (typeof data.audio != "undefined"){
		this.emit("message_audio", this._prepare(data, data.audio));
	}else if (typeof data.document != "undefined"){
		this.emit("message_document", this._prepare(data, data.document));
	}else if (typeof data.photo != "undefined"){
		this.emit("message_photo", this._prepare(data, {
			photo: data.photo
		}));
	}else if (typeof data.sticker != "undefined"){
		this.emit("message_sticker", this._prepare(data, data.sticker));
	}else if (typeof data.contact != "undefined"){
		this.emit("message_contact", this._prepare(data, data.contact));
	}else if (typeof data.localtion != "undefined"){
		this.emit("message_localtion", this._prepare(data, data.localtion));
	}else{
		this.emit("errorDetect", data);
	}
}

TelegramBot.prototype.createServer = function (cb){
	var self = this;
	var server = this.app.listen(this.port, function (){
		cb(self);
	});
}

TelegramBot.prototype._get = function (method, result){
	request(this.baseurl + method, function (error, response, body) {
		if (!error && httpResponse.statusCode == 200) {
			try{
				data = JSON.parse(body);
				if (data.ok){
					result(null, data);
				}else{
					result(data);
				}
			}catch (err){
				result(err, result);
			}
		}else{
			result(error, httpResponse);
		}
	})
}

TelegramBot.prototype._post = function (method, data, result){
	request.post({
		url: this.baseurl + method, 
		form: data
	}, function(error,httpResponse,body){
		if (!error && httpResponse.statusCode == 200) {
			try{
				data = JSON.parse(body);
				if (data.ok){
					result(null, data);
				}else{
					result(data);
				}
			}catch (err){
				result(err, result);
			}
		}else{
			result(error, httpResponse);
		}
	});
}

TelegramBot.prototype.setWebHooks = function (baseurl, cb){
	this._post("setWebhook", {
		url: baseurl
	}, cb);
}


TelegramBot.prototype.getMe = function(cb) {
	this._get("getMe", cb);
};

TelegramBot.prototype.sendMessage = function(data, cb) {
	this._post("sendMessage",data, cb);
};

TelegramBot.prototype.forwardMessage = function(data, cb) {
	this._post("forwardMessage",data, cb);
};

TelegramBot.prototype.sendPhoto = function(data, cb) {
	this._post("sendPhoto",data, cb);
};

TelegramBot.prototype.sendAudio = function(data, cb) {
	this._post("sendAudio",data, cb);
};

TelegramBot.prototype.sendDocument = function(data, cb) {
	this._post("sendDocument",data, cb);
};

TelegramBot.prototype.sendSticker = function(data, cb) {
	this._post("sendSticker",data, cb);
};

TelegramBot.prototype.sendVideo = function(data, cb) {
	this._post("sendVideo",data, cb);
};

TelegramBot.prototype.sendLocation = function(data, cb) {
	this._post("sendLocation",data, cb);
};

TelegramBot.prototype.sendChatAction = function(data, cb) {
	this._post("sendChatAction",data, cb);
};

TelegramBot.prototype.getUserProfilePhotos = function(data, cb) {
	this._post("getUserProfilePhotos",data, cb);
};

TelegramBot.prototype.getUpdates = function(data, cb) {
	this._post("getUpdates",data, cb);
};
module.exports.client = TelegramBot; 