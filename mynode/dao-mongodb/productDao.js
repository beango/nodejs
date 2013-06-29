var util = require('util');
var mongoose = require('mongoose');
var models = require('../model/product');
var dbtype = require('../config').dbtype;
var catedb = require(dbtype+'categoryDao');
var dburl = require("../config").db;//数据库地址

exports.connect = function(callback) {
    mongoose.connect(dburl);
}

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}

models.defineModels(mongoose, function() {
  Product = mongoose.model('Product');
})

exports.new = function(id,callback) {
	if(id)
		exports.findByProductId(id, function(err, doc) {
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

exports.add = function(postproduct,callback) {
    var product = new Product();
    product.productName = postproduct.productName;
    product.supplierID = postproduct.supplierID;
    product.categoryID = postproduct.categoryID;
    product.quantityPerUnit = postproduct.quantityPerUnit;
    product.unitPrice = postproduct.unitPrice;
    product.unitsInStock = postproduct.unitsInStock;
    product.unitsOnOrder = postproduct.unitsOnOrder;
    product.reorderLevel = postproduct.reorderLevel;
    product.discontinued = postproduct.discontinued;
    Product.find({}).sort('-productID').limit(1).exec(function(err, maxproduct){
        product.productID = parseInt(maxproduct[0].productID)+1;
        product.save(function(err){
            if(err){
                util.log("FATAL"+err);
                callback(err);
            }else{
                callback(null);
            }
        });
    });
}

exports.delete = function(id, callback) {
    exports.findByProductId(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.remove();
            callback(null);
        }
    });
}

exports.edit = function(id, product, callback) {
    exports.findByProductId(id, function(err, doc) {
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

            if(doc.productID==null){
                Product.find({}).sort('-productID').limit(1).exec(function(err, maxproduct){
                    doc.productID = parseInt(maxproduct[0].productID)+1;
                    doc.save(function(err){
                        if(err){
                            util.log("FATAL"+err);
                            callback(err);
                        }else{
                            callback(null);
                        }
                    });
                });
            }
            else{
                doc.save(function(err) {
                    if (err) {
                        util.log('FATAL '+ err);
                        callback(err);
                    } else
                        callback(null);
                });
            }
        }
    });
}

exports.count = function(callback) {
    Product.count()
	.exec(callback);
}

exports.all = function(callback) {
    Product.find({}).exec(null,callback);
}

exports.findByPage = function(options,callback) {
    Product.find({}).sort('productID')
	.limit(options.perPage)	
	.skip(options.perPage * (options.page-1)).exec(callback);
}

var findByProductId = exports.findByProductId = function(id,callback){
    Product.findOne({productID:id},function(err,doc){
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}