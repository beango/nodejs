"use strict";

var util = require('util');
var config = require('../config');
var mongoose = require('mongoose');
var db = require('../dao/authDao');

exports.index = function (req, res, next) {
    db.allAuths(function (err, auths) {
        if (err) {
            return next(err);
        }
        res.render('auth/list', {user: req.user,authlist: auths});
    });
};

exports.add = function (req, res, next) {
    res.render('auth/add', {user: req.user});
};

exports.edit = function (req, res, next) {
    var id = req.params.id;
    db.findAuthById(id, function (err, auth) {
        if (err) {
            return next(err);
        }
        if (!auth) {
            return next();
        }
        res.render('auth/add', {user: req.user, auth: auth});
    });
};

exports.save = function (req, res, next) {
    var authPost = mongoose.model('Auth');
    var auth = new Auth(req.body.authinfo);
	if(auth._id){
		db.edit(auth._id,auth,function (err, result) {
			if (err) {
				return next(err);
			}
			res.jsonp({res:true, dec:"修改权限成功！", u:"/auth"});
		});
	}
	else{
		db.add(auth,function (err, result) {
			if (err) {
				res.jsonp({res:false, dec:"添加权限失败！"+err});
			}
      else
			  res.jsonp({res:true, dec:"添加权限成功！", u:"/auth"});
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

