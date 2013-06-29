var util = require('util');
var mongoose = require('mongoose');

var Chat;

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

  /**
    * Model: User
    */
function validatePresenceOf(value) {
  return value && value.length;
}

Chat = new Schema({
    user: String,
    date: Date,
    msg: String
}, { collection: 'Chat', versionKey: false});

mongoose.model('Chat', Chat);

exports.Chat = mongoose.model('Chat'); 
