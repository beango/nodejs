 /*
  Module dependencies.
 */
var env = process.env.NODE_ENV || 'development'
var util = require('util');
var express = require('express');
var app = express();
var fs=require('fs');
var http = require('http')
  , config = require("./config")
  , todoDao = require("./dao-mongodb/todoDao")
  , mongoStore = require('connect-mongodb');

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('port', config.port);
  
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.static(__dirname + '/skin')); //注意顺序，为了能够用到404，要把这个提前。
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  log("Warning: Server in Development Mode, add NODE_ENV=production",true);
});

app.configure('production', function(){
  app.use(express.errorHandler());
  log("Production Mode");
});

var todo = require('./controllers/todo'),
	product = require('./controllers/product'),
	usercon = require('./controllers/user'),
    cate = require('./controllers/cate'),
    role = require('./controllers/role'),
    auth = require('./controllers/auth');
var userstat;

var checkauth = function(req, res, next) {
  if(req.cookies.logintoken){
    var cookie = JSON.parse(req.cookies.logintoken);
    if (cookie) {
      //util.log(JSON.stringify(cookie));
      req.user = cookie;
      userstat = cookie;
      next();
    } else {
      res.redirect('/login?u='+encodeURI(req.url));
    }
  }
  else
    res.redirect('/login?u='+encodeURI(req.url));
}

app.get('/',checkauth, todo.index);
app.get('/initdata',checkauth, todo.initdata);

app.get('/user',checkauth, usercon.index);
app.get('/user/add',checkauth, usercon.add);
app.post('/user/save/:id?',checkauth, usercon.save);
app.get('/user/edit/:id',checkauth, usercon.edit);
app.get('/user/delete/:id',checkauth, usercon.delete);
app.get('/user/role/:id',checkauth, usercon.role);
app.post('/user/userrole/:id',checkauth, usercon.userrole);

app.get('/role',checkauth, role.index);
app.get('/role/add',checkauth, role.add);
app.post('/role/save/:id?',checkauth, role.save);
app.get('/role/edit/:id',checkauth, role.edit);
app.get('/role/delete/:id',checkauth, role.delete);
app.get('/role/auth/:id',checkauth, role.auth);
app.post('/role/roleauth/:id',checkauth, role.roleauth);

app.get('/auth',checkauth, auth.index);
app.get('/auth/add',checkauth, auth.add);
app.post('/auth/save/:id?',checkauth, auth.save);
app.get('/auth/edit/:id',checkauth, auth.edit);
app.get('/auth/delete/:id',checkauth, auth.delete);

app.get('/product',checkauth, product.index);
app.get('/product/add',checkauth, product.add);
app.get('/product/edit/:id',checkauth, product.add);
app.post('/product/save/:id?',checkauth, product.save);
app.post('/product/delete',checkauth, product.delete);

app.get('/cate',checkauth, cate.index);
app.get('/cate/add',checkauth, cate.add);
app.post('/cate/save/:id?',checkauth, cate.save);
app.get('/cate/edit/:id',checkauth, cate.edit);
app.get('/cate/delete/:id',checkauth, cate.delete);

app.get('/login', usercon.login);
app.get('/logout', usercon.logout);
app.post('/loginchk', usercon.loginchk);
app.get('/chat',checkauth, todo.chat);

if (config.dbtype=="../dao-mongodb/"){
    todoDao.connect(function(error){
        util.log('connect db');
        if (error) throw error;
    });
}
app.on('close', function(errno) {
    if (config.dbtype=="../dao-mongodb/"){
        todoDao.disconnect(function(err) {util.log('disconnect db'); });
    }
});

//File not found

app.get('/*', function(req, res){
	res.render('404',{status: 404,
	title:'404 - 文件未找到'});
});

/*
 * chat config
 */
//创建socket
var socketSetting = {
	//关闭 socket.io 的debug 信息
	"log level" : util.log.level
    }
  , server = http.createServer(app)
  , io = require('socket.io').listen(server, socketSetting);

server.listen(app.get('port'), function(){
  util.log("Express server listening on port " + app.get('port'));
});

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

var userList = [];
var getBieberTweet = function(callback){
                            callback(new Date().Format("yyyy-MM-dd hh:mm:ss"));
                            
                        }
var chatDao = require("./dao-tiny/chatDao");

if (config.dbtype=="../dao-mongodb/")
{
    chatDao = require("./dao-mongodb/chatDao");
}
//添加连接监听
io.sockets.on('connection', function(client){
    var clientIp = client.handshake.address.address;
    var curuser = {};
    var isExists = false;
    if(userList.length>0){
        for(var i=0; i<userList.length; i++){
            if(userList[i].userName == user.userName){
                curuser = userList[i];
                curuser.logTime=new Date();
                isExists = true;
            }
        }
    }
    if(!isExists){
        curuser = {userName:userstat.userName,logTime:new Date()};
        userList.push(curuser);
    }

    /*var tweets = setInterval(function () {
        getBieberTweet(function (tweet) {
          client.volatile.emit('bieber tweet', tweet);
        });
    }, 2100);*/

    client.on('ferret', function (name, fn) {
        curuser.logTime = new Date();
        fn(curuser.userName);
    });

    /*client.on('set nickname', function (name) {
        client.set('nickname', name, function () {
          client.emit('ready');
        });
    });

    var clientIp = client.handshake.address.address, 
        userName = "userName"+Math.floor(Math.random()*9999); 
    */
    var userName = curuser.userName;
    
    client.on('sendMsg',function(data){ 
        //接收Client消息
        client.broadcast.emit('message', { 
                                            user: userName,
                                            date: new Date().Format("yyyy-MM-dd hh:mm:ss"),
                                            msg: data.msg, 
                                            userList: userList 
                                        });
        
        util.log("client(" + userName + ") [" + clientIp + "] send msg:\n" + data.msg);
        //消息持久化
        chatDao.add({ user: userName,
                      date: new Date().Format("yyyy-MM-dd hh:mm:ss"), 
                      msg: data.msg
                    },function(){});
    });
    //向Client发送登录信息
    client.emit('connected', {
                                user: "系统",
                                date: new Date().Format("yyyy-MM-dd hh:mm:ss"),
                                msg: userName+"上线！"
                            });
    //广播登录信息
    client.broadcast.emit('message', { 
                                        user: "系统",
                                        date: new Date().Format("yyyy-MM-dd hh:mm:ss"), 
                                        msg: userName+"上线！", 
                                        userList: userList 
                                    });
    
    //登录信息持久化
    chatDao.add({ user: "系统",
                   date: new Date().Format("yyyy-MM-dd hh:mm:ss"), 
                   msg: userName+"上线！"
                },function(){ });

    client.on('disconnect', function(){
        //clearInterval(tweets);
        //广播退出信息
        for(var i=0; i<userList.length; i++){
            if(userList[i].userName=userName)
                userList.splice(i,1);
        }
        client.broadcast.emit('disconnectmsg', { 
                                        user: "系统",
                                        date: new Date().Format("yyyy-MM-dd hh:mm:ss"), 
                                        msg: userName+"下线！", 
                                        userList: userList 
                                    });
        //退出信息持久化
        chatDao.add({ user: "系统",
                   date: new Date().Format("yyyy-MM-dd hh:mm:ss"), 
                   msg: userName+"下线！"
                },function(){ });    
    });
});

var tweets = setInterval(function () {
    util.log(JSON.stringify(userList))
    for(var i=0; i<userList.length; i++){
        if(new Date() - userList[i].logTime>10000)
            userList.splice(i,1);
    }
}, 2000);
