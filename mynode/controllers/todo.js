"use strict";
Date.prototype.Format = function(fmt)   
{ //author: meizz   
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
}  

var util = require('util');
var config = require('../config');
var dbpath = require("../config").dbpath;//数据库地址
var tiny = require('tiny');

exports.index = function (req, res, next) {
    res.render('index', {todos: "hello world!",user:req.user});
};

exports.chat = function (req, res, next) {
    res.render('chat', {todos: "开始聊天",user:req.user});
};

exports.chatadd = function (req, res, next) {
    util.log('chatadd');
};
exports.initdata = function (req, res, next) {
    var list = [{filename:"user",tablename:"User"},{filename:"auth",tablename:"Auth"},{filename:"category",tablename:"Category"},
                {filename:"product",tablename:"Product"},{filename:"role",tablename:"Role"}];
    
    for(var item in list){
        initdatafun(list[item],function(){ });
    }
    res.render('index', {todos: "数据初始化完成!",user:req.user});
}

var initdatafun = function (tablename,callback) {
    var fromDao = require("../dao-mongodb/"+tablename.filename+"Dao");
    var index=0;
    fromDao.all(function(err,items){
        if(err)
            util.log("出错啦");
        //util.log("items.length:"+items.length);
        tiny(dbpath + 'Northwind.'+tablename.tablename+'.tiny', function(err, db) {
                var t = setInterval(function(){
                    var item = JSON.parse(JSON.stringify(items[index]));
                    delete item._id;
                    if(tablename.tablename=='Category')
                        delete item.picture;
                    item.addTime = new Date().Format("yyyy-MM-dd hh:mm:ss");
                    //util.log(JSON.stringify(item));
                    db.set(tablename.tablename + item[tablename.filename+"ID"], item, function(err) {
                        if (err)
                            callback(err);
                    });
                    index++;
                    //util.log(index);
                    if(index>=items.length)
                        clearInterval(t);
                }
                ,80);
        });
        
        callback(null);
    });
};

var setItem = function(prefix, item){
    util.log(JSON.stringify(item));
    /*db.set(prefix + item.[tablename.filename+"ID"], item, function(err) {
        if (err)
            callback(err);
    });*/
}