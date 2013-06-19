 /*
  Module dependencies.
 */
var env = process.env.NODE_ENV || 'development'
var util = require('util');
var express = require('express');
var app = express();
var fs=require('fs');
var mongoose = require('mongoose')
  , http = require('http')
  , config = require("./config")
  , todoDao = require("./dao/todoDao")
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
	user = require('./controllers/user'),
  cate = require('./controllers/cate');

var checkauth = function(req, res, next) {
  if(req.cookies.logintoken){
    var cookie = JSON.parse(req.cookies.logintoken);
    if (cookie) {
      //util.log(JSON.stringify(cookie));
      req.user = cookie;
      next();
    } else {
      res.redirect('/login?u='+encodeURI(req.url));
    }
  }
  else
    res.redirect('/login?u='+encodeURI(req.url));
}

app.get('/',checkauth, todo.index);

app.get('/product',checkauth, product.index);
app.get('/product/add',checkauth, product.add);
app.get('/product/edit/:id',checkauth, product.add);
app.post('/product/save/:id?',checkauth, product.save);
app.post('/product/delete',checkauth, product.delete);

app.get('/cate',checkauth, cate.index);
app.get('/cate/add',checkauth, cate.add);
app.post('/cate/save/',checkauth, cate.save);
app.get('/cate/edit/:id',checkauth, cate.edit);
app.get('/cate/delete/:id',checkauth, cate.delete);

app.get('/login', user.login);
app.get('/logout', user.logout);
app.post('/loginchk', user.loginchk);

todoDao.connect(function(error){
    if (error) throw error;
});
app.on('close', function(errno) {
    todoDao.disconnect(function(err) { });
});

//File not found

app.get('/*', function(req, res){
	res.render('404',{status: 404,
	title:'404 - 文件未找到'});
});

http.createServer(app).listen(app.get('port'), function(){
  util.log("Express server listening on port " + app.get('port'));
});


