//This is an object model used by mongoose

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Record', new Schema({
	userid: String,
	name: String,
	instrumentid: String,
	instrumentname: String,
	date: Date
}));
