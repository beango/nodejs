var util = require('util');
var mongoose = require('mongoose');
var models = require('../model/role');
var Role = models.Role;
var dburl = require("../config").db;//数据库地址

exports.connect = function(callback) {
    mongoose.connect(dburl);
}

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}

exports.add = function(postrole,callback) {
    var newrole = new Role();
    newrole.roleName = postrole.roleName;
    Role.find({}).sort('-roleID').limit(1).exec(function(err, maxrole){
        if(err){
            util.log("FATAL"+err);
            callback(err);
        }else{
            newrole.roleID = maxrole[0].roleID+1;
            newrole.save(function(err){
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
    exports.findRoleById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.remove();
            callback(null);
        }
    });
}

exports.edit = function(id, postrole, callback) {
    exports.findRoleById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.roleName = postrole.roleName;
            
            if(null!=postrole.authID && postrole.authID.length > 0)
                doc.authID = postrole.authID;
            else
                doc.authID = undefined;
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
    Role.find({}).sort("roleID").exec(callback);
}

var findRoleById = exports.findRoleById = function(id,callback){
    Role.findOne({roleID:id},function(err,doc){
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}