var util = require('util');
var mongoose = require('mongoose');

var Role;

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

  /**
    * Model: User
    */
function validatePresenceOf(value) {
  return value && value.length;
}

Role = new Schema({
    roleID: Number,
    roleName: String,
    authID: Array
}, { collection: 'Role', versionKey: false});

mongoose.model('Role', Role);

exports.Role = mongoose.model('Role'); 