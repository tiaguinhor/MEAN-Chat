var mongoose = require('mongoose');

//MongoDB Schemas
var roomSchema = new mongoose.Schema({
	name: String,
	username: String
});

var Room = mongoose.model('Room', roomSchema);
module.exports = Room;