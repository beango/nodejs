var util = require('util');
var tiny = require('tiny');
var dbpath = require("../config").dbpath;//数据库地址

exports.add = function(postauth,callback) {
	tiny(dbpath + 'Northwind.Auth.tiny', function(err, db) {
      db.find()
      .desc('authID')
      .limit(1)(function(err, top1) {
        postauth.authID = 1;
        if(top1!=null&&top1.length>0){
            postauth.authID = parseInt(top1[0].authID)+1;
        }
        db.set('Auth'+postauth.authID, postauth, function(err) {
            if (err)
              callback(err);
            callback(null);
        });
      });
    });
}

exports.delete = function(id, callback) {
    tiny(dbpath + 'Northwind.Auth.tiny', function(err, db) {
        // remove a doc
        db.remove('Auth'+id, function(err) {
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

exports.edit = function(id, postauth, callback) {
    tiny(dbpath + 'Northwind.Auth.tiny', function(err, db) {
        exports.findAuthById(id, function(err, auth) {
            if (err)
                callback(err);
            else {
                auth.authName = postauth.authName;
                db.update('Auth'+auth.authID, auth, function(err) {
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
    });}

exports.all = function(callback) {
  tiny(dbpath + 'Northwind.Auth.tiny', function(err, db) {
	  // mongo-style query
	  db.find()(function(err, results) {
		if (err)
            callback(null,{});
        else 
			callback(null,results);
	  });
  });
}

var findAuthById = exports.findAuthById = function(id,callback){
    tiny(dbpath + 'Northwind.Auth.tiny', function(err, db) {
	    // retrieve an object from the database
        db.get('Auth'+id, function(err, data) {
          // data._key is a property which
          // holds the key of every object
          callback(null,data);
        });
    });
}