var util = require('util');
var mongoose = require('mongoose');
var models = require('../model/useraccount');
var dburl = require("../config").db;//数据库地址

exports.connect = function(callback) {
    mongoose.connect(dburl);
}

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}

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
            if(null!=postuser.roleID && postuser.roleID.length > 0)
                doc.roleID = postuser.roleID;
            else
                doc.roleID = undefined;
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

exports.all = function(callback) {
    UserAccount.find({}).sort('userID').exec(null,callback);
}

var findUserById = exports.findUserById = function(id,callback){
    UserAccount.findOne({userID:id},function(err,doc){
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