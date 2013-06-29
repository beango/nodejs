"use strict";

var util = require('util');
var config = require('../config');
var dbtype = require('../config').dbtype;
var db = require(dbtype + 'authDao');

exports.index = function (req, res, next) {
    db.all(function (err, auths) {
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
    var id = req.params.id;
    var auth = req.body.authinfo;
	if(id){
		db.edit(id,auth,function (err, result) {
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

