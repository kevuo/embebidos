//This is an object model used by mongoose

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Administrator', new Schema({
	username: String,
	pass: String
}));
