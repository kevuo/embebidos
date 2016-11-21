//This is an object model used by mongoose

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

module.exports = mongoose.model('Instrument', new Schema({
  name: String,
  id: String,
  quantity: Number
}));
