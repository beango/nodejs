var util = require('util');

var UserAccount;

function defineModels(mongoose, fn) {
  var Schema = mongoose.Schema,
      ObjectId = Schema.ObjectId;

  /**
    * Model: User
    */
  function validatePresenceOf(value) {
    return value && value.length;
  }

  UserAccount = new Schema({
      userID:Number,
      userName:String,
      userPwd:String
  }, { collection: 'UserAccount', versionKey: false});

  UserAccount.virtual('id')
    .get(function() {
      return this._id.toHexString();
    });

  UserAccount.method('authenticate', function(plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  });
  
  UserAccount.method('makeSalt', function() {
    return Math.round((new Date().valueOf() * Math.random())) + '';
  });

  UserAccount.method('encryptPassword', function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
  });

  UserAccount.pre('save', function(next) {
    if (!validatePresenceOf(this.password)) {
      next(new Error('Invalid password'));
    } else {
      next();
    }
  });

  mongoose.model('UserAccount', UserAccount);

  fn();
}

exports.defineModels = defineModels; 