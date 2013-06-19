"use strict";

var util = require('util');
var config = require('../config');
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