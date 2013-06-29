var util = require('util');
var tiny = require('tiny');
var dbpath = require("../config").dbpath;//数据库地址

exports.add = function(postrole,callback) {
	tiny(dbpath + 'Northwind.Role.tiny', function(err, db) {
      db.find()
      .desc('roleID')
      .limit(1)(function(err, top1) {
        postrole.roleID = 1;
        if(top1!=null&&top1.length>0){
            postrole.roleID = parseInt(top1[0].roleID)+1;
        }
        db.set('Role'+postrole.roleID, postrole, function(err) {
            if (err)
              callback(err);
            db.close(function(err) {
                if (err)
                    callback(err);
                callback(null);
             });
        });
      });
    });
}

exports.delete = function(id, callback) {
    tiny(dbpath + 'Northwind.Role.tiny', function(err, db) {
        // remove a doc
        db.remove('Role'+id, function(err) {
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

exports.edit = function(id, postrole, callback) {
    tiny(dbpath + 'Northwind.Role.tiny', function(err, db) {
        exports.findRoleById(id, function(err, role) {
            if (err)
                callback(err);
            else {
                role.roleName = postrole.roleName;
                if(postrole.authID!=null && postrole.authID.length>0)
                    role.authID = postrole.authID;
                else
                    role.authID = [];
                db.update('Role'+role.roleID, role, function(err) {
                    if (err){
                        callback(err);
                    }
                    else {
                        // clean up the mess
                        db.compact(function(err) {
                            if (err){
                                callback(err);
                            }
                            db.close(function(err) {
                                if (err){
                                    callback(err);
                                }
                                callback(null,true);
                            });
                        });
                    }
                });
            }
        });
    });}

exports.all = function(callback) {
  tiny(dbpath + 'Northwind.Role.tiny', function(err, db) {
	  db.find().desc('roleID')(function(err, results) {
		if (err)
            callback(null,{});
        else {
            db.close(function(err) {
                if (err)
                    callback(err);
                callback(null,results);
             });
        }
	  });
  });
}

var findRoleById = exports.findRoleById = function(id,callback){
    tiny(dbpath + 'Northwind.Role.tiny', function(err, db) {
	    // retrieve an object from the database
        db.get('Role'+id, function(err, data) {
            if (err)
                callback(err);
            // data._key is a property which
            // holds the key of every object
            callback(null,data);
        });
    });
}