"use strict";

var util = require('util');
var config = require('../config');
var dbtype = require('../config').dbtype;
var db = require(dbtype + 'categoryDao');

exports.index = function (req, res, next) {
    db.all(function (err, todos) {
        if (err) {
            return next(err);
        }
        res.render('cate/list', {user: req.user,catelist: todos});
    });
};

exports.add = function (req, res, next) {
    res.render('cate/add', {user: req.user});
};

exports.view = function (req, res, next) {
    res.redirect('/');
};

exports.edit = function (req, res, next) {
    var id = req.params.id;
    db.findCateById(id, function (err, cate) {
        if (err) {
            return next(err);
        }
        if (!cate) {
            return next();
        }
        res.render('cate/add', {user: req.user, cate: cate});
    });
};

exports.save = function (req, res, next) {
    var id = req.params.id;
	if(id){
		db.edit(id,req.body.cate,function (err, result) {
			if (err) {
				return next(err);
			}
			res.jsonp({res:true, dec:"修改目录成功！", u:"/cate"});
		});
	}
	else{
		db.add(req.body.cate,function (err, result) {
			if (err) {
				res.jsonp({res:false, dec:"添加目录失败！"+err});
			}
			else
				res.jsonp({res:true, dec:"添加目录成功！", u:"/cate"});
		});
	}
};

exports.delete = function (req, res, next) {
    var id = req.params.id;
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
