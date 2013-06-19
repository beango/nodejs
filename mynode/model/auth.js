var util = require('util');
var mongoose = require('mongoose');

var Auth;

var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

  /**
    * Model: User
    */
  Auth = new Schema({
      authID: Number,
      authName: String
  }, { collection: 'Auth', versionKey: false});

  mongoose.model('Auth', Auth);

exports.Auth = mongoose.model('Auth'); 