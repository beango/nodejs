"use strict";

var util = require('util');
var config = require('../config');
var db = require('../dao/productDao');
var catedb = require('../dao/cateDao');
var mongoose = require('mongoose');

exports.index = function (req, res, next) {
    util.log(req.user.userName);
	var page = req.param('page') > 1 ? req.param('page') : 1;
    var perPage = 15;
    var options = {
        perPage: perPage,
        page: page
    };
	
    db.allProducts(options, function (err, todos) {
      if (err) {
        return next(err);
      }
      db.count(function(err,count){
        if(err)
          return next(err);
        catedb.allCate(function (err, cates) {
          if (err) {
            return next(err);
          }
          res.render('product/list', {
            user: req.user,
            products: todos,
            catelist: cates, 
            total: count, 
            perpage: perPage,
            totalpage: Math.ceil(count / perPage),
            curpage: page
          });
        });
      });
    });
};

exports.add = function (req, res, next) {
	db.new(req.params.id, function (err, product) {
		if (err) {
            return next(err);
        }
        catedb.allCate(function (err, cates) {
			if (err) {
				return next(err);
			}
			res.render('product/add', {user: req.user, product: product, catelist: cates});
		});
    });
};

exports.view = function (req, res, next) {
	res.redirect('/');
};

exports.edit = function (req, res, next) {
    var id = req.params.id;
    db.findTodoById(id, function (err, row) {
        if (err) {
            return next(err);
        }
        if (!row) {
            return next();
        }
        res.render('todo/edit.html', {todo: row});
    });
};

exports.save = function (req, res, next) {
    var id = req.params.id;
	var productPost = mongoose.model('Product');
    var product = new productPost(req.body.product);
	if(id){
		db.edit(id,product,function (err, result) {
			if (err) {
                res.jsonp({res:false, dec:"修改产品失败！"});
				return next(err);
			}
			res.jsonp({res:true, dec:"修改产品成功！", u:"/product"});
		});
	}
	else{
		db.add(product,function (err, result) {
			if (err) {
				res.jsonp({res:false, dec:"添加产品失败！"});
                return next(err);
			}
            else
			    res.jsonp({res:true, dec:"添加产品成功！", u:"/product"});
		});
	}
};

exports.delete = function (req, res, next) {
    var id = req.param('id');
    db.delete(id, function (err) {
        if (err) {
            return next(err);
        }
        res.jsonp({res:true, dec:"删除成功！", u:req.headers.referer});
    });
};

exports.finish = function (req, res, next) {
    var finished = req.query.status === 'yes' ? true : false;
    var id = req.params.id;
    db.editFinished(id,finished, function (err, result) {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
};
