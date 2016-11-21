//This is an object model used by mongoose

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('User', new Schema({
	id: String,
	name: String
}));
