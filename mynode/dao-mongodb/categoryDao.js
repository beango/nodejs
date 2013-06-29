var util = require('util');
var models = require('../model/category');
var Cate = models.Cate;
var dburl = require("../config").db;//数据库地址

exports.connect = function(callback) {
    mongoose.connect(dburl);
}

exports.disconnect = function(callback) {
    mongoose.disconnect(callback);
}

exports.add = function(catePost,callback) {
    var cate = new Cate();
    cate.categoryName = catePost.categoryName;
    cate.description = catePost.description;
    Cate.find({}).sort('-categoryID').limit(1).exec(function(err, maxcate){
        if(err){
            util.log("FATAL"+err);
            callback(err);
        }else{
            cate.categoryID = maxcate[0].categoryID+1;
            cate.save(function(err){
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
    exports.findCateById(id, function(err, doc) {
        if (err)
            callback(err);
        else {
            doc.remove();
            callback(null);
        }
    });
}

exports.edit = function(id, catePost, callback) {
    exports.findCateById(id, function(err, cate) {
        if (err)
            callback(err);
        else {
            cate.categoryID = catePost.categoryID;
            cate.categoryName = catePost.categoryName;
            cate.description = catePost.description;
            cate.save(function(err) {
                if (err) {
                    util.log('FATAL '+ err);
                    callback(err);
                } else
                    callback(null);
            });
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

exports.all = function(callback) {
    Cate.find({}).sort('categoryID').exec(null,callback);
}

var findCateById = exports.findCateById = function(id,callback){
    Cate.findOne({categoryID:id},function(err,doc){
        if (err) {
            util.log('FATAL '+ err);
            callback(err, null);
        }
        callback(null, doc);
    });
}