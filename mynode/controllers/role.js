"use strict";

var util = require('util');
var config = require('../config');
var dbtype = require('../config').dbtype;
var db = require(dbtype+'roleDao');

exports.index = function (req, res, next) {
    db.all(function (err, roles) {
        if (err) {
            return next(err);
        }
        res.render('role/list', {user: req.user,rolelist: roles});
    });
};

exports.add = function (req, res, next) {
    res.render('role/add', {user: req.user});
};

exports.edit = function (req, res, next) {
    var id = req.params.id;
    db.findRoleById(id, function (err, role) {
        if (err) {
            return next(err);
        }
        if (!role) {
            return next();
        }
        res.render('role/add', {user: req.user, roleinfo: role});
    });
};

exports.save = function (req, res, next) {
    var id=req.params.id;
    var role = req.body.role;
  
	if(id){
        db.findRoleById(id, function (err, _role) {
            if (err) {
                return next(err);
            }
            if (!_role) {
                return next();
            }
            role.authID = _role.authID;
            db.edit(id,role,function (err, result) {
                if (err) {
                    util.log("修改用户资料出错！");
                    return next(err);
                }
                res.jsonp({res:true, dec:"修改用户成功！", u:"/role"});
            });
        });
	}
	else{
		db.add(role,function (err, result) {
			if (err) {
				res.jsonp({res:false, dec:"添加用户失败！"+err});
			}
            else
                  res.jsonp({res:true, dec:"添加用户成功！", u:"/role"});
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

exports.auth = function (req, res, next) {
    var id = req.params.id;
    db.findRoleById(id, function (err, role) {
        if (err) {
            return next(err);
        }
        if (!role) {
            return next();
        }
        var authdb = require(dbtype+"authdao");
        authdb.all(function(err,auths){
            if(err)
                next(err);
            res.render("role/auth", {user: req.user, role: role, authlist: auths});
        })
    });
};

exports.roleauth = function (req, res, next) {
    var id = req.params.id;
    var role = req.body.roleauth;
    db.findRoleById(id,function(err,_role){
        if(err)
            next(err);
        if(_role){
            _role.authID = role.authID;
            db.edit(id, _role, function(err){
                if(err)
                    next(err);
                res.jsonp({res:true, dec:"修改角色权限成功！", u:"/role"});
            });
        }
        else
            next();
    });
}