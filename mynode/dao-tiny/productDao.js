var util = require('util');
var tiny = require('tiny');
var dbtype = require('../config').dbtype;
var catedb = require(dbtype+'categoryDao');
var dbpath = require("../config").dbpath;//数据库地址

exports.new = function(id,callback) {
	if(id)
		exports.findProductById(id, function(err, doc) {
			if (err)
				callback(err);
			else {
				catedb.all(function (err, cates) {
					if (err) {
						return next(err);
					}
					callback(null, doc, cates);
				});
			}
		});
	else
	{
		catedb.all(function (err, cates) {
			if (err) {
				return next(err);
			}
			callback(null, null, cates);
		});
	}
}

exports.add = function(product,callback) {
    tiny(dbpath + 'Northwind.Product.tiny', function(err, db) {
      db.find()
      .desc('productID')
      .limit(1)(function(err, top1) {
        product.productID = 1;
        if(top1!=null&&top1.length>0){
            product.productID = parseInt(top1[0].productID)+1;
        }
        db.set('Product'+product.productID, product, function(err) {
            if (err)
              callback(err);
            callback(null);
        });
      });
    });
}

exports.delete = function(id, callback) {
    tiny(dbpath + 'Northwind.Product.tiny', function(err, db) {
        // remove a doc
        db.remove('Product'+id, function(err) {
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

exports.edit = function(id, product, callback) {
    tiny(dbpath + 'Northwind.Product.tiny', function(err, db) {
        exports.findProductById(id, function(err, doc) {
            if (err)
                callback(err);
            else {
                doc.productName = product.productName;
                doc.supplierID = product.supplierID;
                doc.categoryID = product.categoryID;
                doc.quantityPerUnit = product.quantityPerUnit;
                doc.unitPrice = product.unitPrice;
                doc.unitsInStock = product.unitsInStock;
                doc.unitsOnOrder = product.unitsOnOrder;
                doc.reorderLevel = product.reorderLevel;
                doc.discontinued = product.discontinued;

                db.update('Product'+doc.productID, doc, function(err) {
                    // clean up the mess
                    db.compact(function(err) {
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

exports.count = function(callback) {
    tiny(dbpath + 'Northwind.Product.tiny', function(err, db) {
	  // mongo-style query
	  db.find().count()(function(err, totalcount) {
		if (err)
            callback(err);
        else {
			callback(null,totalcount);
        }
	  });
    });
}
exports.findByPage = function(options,callback) {
	tiny(dbpath + 'Northwind.Product.tiny', function(err, db) {
          // mongo-style query
          db.find({}).count()(function(err, results) {
                if (err)
                    callback(null,{});
                else {
                      db.find({}).asc('productID')
                      .skip(options.perPage * (options.page-1))
                      .limit(options.perPage)(function(err, results) {
                        if (err)
                            callback(null,{});
                        else {
                            callback(null,results);
                        }
                      });
                }
          });
    });
    /*Product.find({})
	.limit(options.perPage)	
	.skip(options.perPage * (options.page-1)).exec(callback);*/
}

var findProductById = exports.findProductById = function(id,callback){
    tiny(dbpath + 'Northwind.Product.tiny', function(err, db) {
	    // retrieve an object from the database
        db.get('Product'+id, function(err, data) {
          // data._key is a property which
          // holds the key of every object
          callback(null,data);
        });
  });
}