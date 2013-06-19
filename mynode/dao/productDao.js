var util = require('util');
var mongoose = require('mongoose');
var models = require('../model/product');
var catedb = require('../dao/cateDao');

models.defineModels(mongoose, function() {
  Product = mongoose.model('Product');
})

exports.new = function(id,callback) {
	if(id)
		exports.findByProductId(id, function(err, doc) {
			if (err)
				callback(err);
			else {
				catedb.allCate(function (err, cates) {
					if (err) {
						return next(err);
					}
					callback(null, doc, cates);
				});
			}
		});
	else
	{
		catedb.allCate(function (err, cates) {
			if (err) {
				return next(err);
			}
			callback(null, null, cates);
		});
	}
}

exports.add = function(product,callback) {
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
            doc.productID = product.productID;
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

exports.editFinished = function(id, finished, callback) {
    exports.findTodoById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.post_date = new Date();
            doc.finished = finished;
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
exports.count = function(callback) {
    Product.count()
	.exec(callback);
}
exports.allProducts = function(options,callback) {
    Product.find({})
	.limit(options.perPage)	
	.skip(options.perPage * (options.page-1)).exec(callback);
}

exports.forAll = function(doEach, done) {
    Product.find({}, function(err, docs) {
        if (err) {
            util.log('FATAL '+ err);
            done(err, null);
        }
        docs.forEach(function(doc) {
            doEach(null, doc);
        });
        done(null);
    });
}

var findByProductId = exports.findByProductId = function(id,callback){
    Product.findOne({_id:id},function(err,doc){
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}