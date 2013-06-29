var util = require('util');
var mongoose = require('mongoose');
var models = require('../model/chat');
var Chat = models.Chat;
var dburl = require("../config").db;//数据库地址

exports.connect = function(callback) {
    mongoose.connect(dburl);
}

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}

exports.add = function(postobj,callback) {
    var newobj = new Chat();
    newobj.user = postobj.user;
    newobj.date = postobj.date;
    newobj.msg = postobj.msg;
    
    
    newobj.save(function(err){
        if(err){
            util.log("FATAL"+err);
            callback(err);
        }else{
            callback(null);
        }
    });
}

var findById = exports.findById = function(id,callback){
    Chat.findOne({_id:id},function(err,doc){
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}