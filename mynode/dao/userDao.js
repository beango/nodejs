var util = require('util');
var mongoose = require('mongoose');
var models = require('../model/useraccount');

models.defineModels(mongoose, function() {
    UserAccount = mongoose.model('UserAccount');
})

exports.add = function(postuser,callback) {
    var newuser = new UserAccount();
    newuser.userName = postuser.userName;
    newuser.userPwd = postuser.userPwd;
    UserAccount.find({}).sort('-userID').limit(1).exec(function(err, maxuser){
        if(err){
            util.log("FATAL"+err);
            callback(err);
        }else{
            newuser.userID = maxuser[0].userID+1;
            newuser.save(function(err){
                if(err){
                    util.log("FATAL"+err);
                    callback(err);
                }else{
                    callback(null);
                }
            });
        }
    });
}

exports.delete = function(id, callback) {
    exports.findUserById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.remove();
            callback(null);
        }
    });
}

exports.edit = function(id, postuser, callback) {
    exports.findUserById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.userName = postuser.userName;
            doc.userPwd = postuser.userPwd;
            doc.roleID = postuser.roleID;

            doc.save(function(err) {
                if (err) {
                    util.log('FATAL '+ err);
                    callback(err);
                } else
                    callback(null);
            });
        }
    });
}

exports.allUsers = function(callback) {
    UserAccount.find({}, callback);
}

var findUserById = exports.findUserById = function(id,callback){
    UserAccount.findOne({_id:id},function(err,doc){
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}

var userAccountChk = exports.userAccountChk = function(username,pwd,callback){
    UserAccount.findOne({userName:username,userPwd:pwd},function(err,doc){
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}