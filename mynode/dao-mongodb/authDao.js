var util = require('util');
var mongoose = require('mongoose');
var models = require('../model/auth');
var Auth = models.Auth;
var dburl = require("../config").db;//数据库地址

exports.connect = function(callback) {
    mongoose.connect(dburl);
}

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}

exports.add = function(postauth,callback) {
    var newauth = new Auth();
    newauth.authName = postauth.authName;
    Auth.find({}).sort('-authID').limit(1).exec(function(err, maxauth){
        if(err){
            util.log("FATAL"+err);
            callback(err);
        }else{
            newauth.authID = maxauth[0].authID+1;
            newauth.save(function(err){
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
    exports.findAuthById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.remove();
            callback(null);
        }
    });
}

exports.edit = function(id, postauth, callback) {
    exports.findAuthById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.authName = postauth.authName;
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
    Auth.find({}).sort('authID').exec(callback);
}

var findAuthById = exports.findAuthById = function(id,callback){
    Auth.findOne({authID:id},function(err,doc){
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}