var util = require('util');
var tiny = require("tiny");
var dbpath = require("../config").dbpath;//数据库地址

exports.add = function(catePost,callback) {
	tiny(dbpath + 'Northwind.Category.tiny', function(err, db) {
      db.find()
      .desc('categoryID')
      .limit(1)(function(err, top1) {
        catePost.categoryID = 1;
        if(top1!=null&&top1.length>0){
            catePost.categoryID = parseInt(top1[0].categoryID)+1;
        }
        db.set('Category'+catePost.categoryID, catePost, function(err) {
            if (err)
              callback(err);
            callback(null);
        });
      });
    });
};

exports.delete = function(id, callback) {
    tiny(dbpath + 'Northwind.Category.tiny', function(err, db) {
        // remove a doc
        db.remove('Category'+id, function(err) {
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

exports.edit = function(id, catePost, callback) {
    tiny(dbpath + 'Northwind.Category.tiny', function(err, db) {
        exports.findCateById(id, function(err, cate) {
            if (err)
                callback(err);
            else {
                cate.categoryName = catePost.categoryName;
                cate.description = catePost.description;
                db.update('Category'+cate.categoryID, cate, function(err) {
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
  tiny(dbpath + 'Northwind.Category.tiny', function(err, db) {
	  // mongo-style query
	  db.find()(function(err, results) {
		if (err)
            callback(null,{});
        else 
			callback(null,results);
	  });
  });
}

var findCateById = exports.findCateById = function(id,callback){
    tiny(dbpath + 'Northwind.Category.tiny', function(err, db) {
	    // retrieve an object from the database
        db.get('Category'+id, function(err, data) {
          // data._key is a property which
          // holds the key of every object
          callback(null,data);
        });
    });
}