"use strict";

var util = require('util');
var config = require('../config');
var mongoose = require('mongoose');
var userdb = require('../dao/userDao');

exports.login = function (req, res, next) {
	res.render('login');
};

exports.loginchk = function (req, res, next) {
	var account = req.body["username"] || '';
	var password = req.body["password"] || '';
	userdb.userAccountChk(account, password, function(err,user){
		if(err)
		  res.jsonp({res:false, dec:"登录失败！"});
    if(user){
      var cookieval = JSON.stringify(user);
      res.cookie('logintoken', cookieval, { expires: new Date(Date.now() + 2 * 604800000), path: '/' });
      res.jsonp({res:true, dec:"登录成功！", u:req.params["u"]});
    }
    else{
      res.jsonp({res:false, dec:"登录失败:用户名或密码错误！"});
    }
	});
};

exports.logout = function (req, res, next) {
	res.clearCookie('logintoken');
  res.redirect('/login');
};

exports.index = function (req, res, next) {
    userdb.allUsers(function (err, users) {
        if (err) {
            return next(err);
        }
        res.render('user/list', {user: req.user,userlist: users});
    });
};

exports.add = function (req, res, next) {
    res.render('user/add', {user: req.user});
};

exports.edit = function (req, res, next) {
    var id = req.params.id;
    userdb.findUserById(id, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next();
        }
        res.render('user/add', {user: req.user, useraccount: user});
    });
};

exports.save = function (req, res, next) {
    var userPost = mongoose.model('UserAccount');
    var user = new UserAccount(req.body.useraccount);
  
	if(user._id){
		userdb.edit(user._id,user,function (err, result) {
			if (err) {
				return next(err);
			}
			res.jsonp({res:true, dec:"修改用户成功！", u:"/user"});
		});
	}
	else{
		userdb.add(user,function (err, result) {
			if (err) {
				res.jsonp({res:false, dec:"添加用户失败！"+err});
			}
      else
			  res.jsonp({res:true, dec:"添加用户成功！", u:"/user"});
		});
	}
};

exports.delete = function (req, res, next) {
    var id = req.params.id;
    userdb.delete(id, function (err) {
        if (err) {
            return next(err);
        }
        res.jsonp({res:true, dec:"删除成功！", u:req.headers.referer});
    });
};

exports.role = function (req, res, next) {
    var id = req.params.id;
    userdb.findUserById(id, function (err, user) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return next();
        }
        var roledb = require("../dao/roledao");
        roledb.allRoles(function(err,roles){
            if(err)
                next(err);
            res.render("user/role", {user: req.user, useraccount: user, rolelist: roles});
        })
    });
};

exports.userrole = function (req, res, next) {
    var id = req.params.id;
    var useraccount = new UserAccount(req.body.userrole);

    userdb.findUserById(id,function(err,useracc){
        if(err)
            next(err);
        if(useracc){
            useracc.roleID = useraccount.roleID;
            userdb.edit(id, useracc, function(err){
                if(err)
                    next(err);
                res.jsonp({res:true, dec:"修改用户角色成功！", u:"/user"});
            });
        }
        else
            next();
    });
}