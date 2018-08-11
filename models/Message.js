var mongoose = require('mongoose');

//MongoDB Schemas
var chatMessage = new mongoose.Schema({
	room: String,
	username: String,
	message: String
});

var Message = mongoose.model('Message', chatMessage);
module.exports = Message;