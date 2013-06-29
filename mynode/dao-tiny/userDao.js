var util = require('util');
var tiny = require('tiny');
var dbpath = require("../config").dbpath;//数据库地址

exports.add = function(postuser,callback) {
    tiny(dbpath + 'Northwind.User.tiny', function(err, db) {
      db.find()
      .desc('userID')
      .limit(1)(function(err, top1) {
        postuser.userID = 1;
        if(top1!=null&&top1.length>0){
            postuser.userID = parseInt(top1[0].userID)+1;
        }
        db.set('User'+postuser.userID, postuser, function(err) {
            if (err)
              callback(err);
            callback(null);
        });
      });
    });
}

exports.delete = function(id, callback) {
    tiny(dbpath + 'Northwind.User.tiny', function(err, db) {
        // remove a doc
        db.remove('User'+id, function(err) {
            // clean up the mess
            db.compact(function(err) {
                db.close(function(err) {
                    if (err)
                        callback(err);
                    callback(null);
                 });
            });
        });
    });
}

exports.edit = function(id, postuser, callback) {
    tiny(dbpath + 'Northwind.User.tiny', function(err, db) {
        exports.findUserById(id, function(err, user) {
            if (err)
                callback(err);
            else {
                user.userName = postuser.userName;
                user.userPwd = postuser.userPwd;
                if(postuser.roleID && postuser.roleID.length>0)
                    user.roleID = postuser.roleID;
                else
                    user.roleID = [];
                db.update('User'+user.userID, user, function(err) {
                    if (err)
                        callback(err);
                    // clean up the mess
                    db.compact(function(err) {
                        if (err)
                            callback(err);
                        db.close(function(err) {
                            if (err)
                                callback(err);
                            callback(null);
                        });
                    });
                });
            }
        });
    });
}

exports.all = function(callback) {
    tiny(dbpath + 'Northwind.User.tiny', function(err1, db) {
        if (err1){
            callback(err1);
        }
	    // mongo-style query
	    db.find()(function(err2, results) {
		  if (err2){
              callback(null,{});
          }
          else 
			  callback(null,results);
	    });
    });
}

var findUserById = exports.findUserById = function(id,callback){
    tiny(dbpath + 'Northwind.User.tiny', function(err, db) {
	    // retrieve an object from the database
        db.get('User'+id, function(err, data) {
          // data._key is a property which
          // holds the key of every object
          callback(null,data);
        });
    });
}

var userAccountChk = exports.userAccountChk = function(username,pwd,callback){
    tiny(dbpath + 'Northwind.User.tiny', function(err, db) {
	    // retrieve an object from the database
        db.find({
          userName:username,userPwd:pwd
        }, function(err, data) {
          // data._key is a property which
          // holds the key of every object
            if (err)
                callback(err);
            if(data && data.length==0)
                callback("不存在")
            callback(null,data[0]);
        });
    });
}