var express = require('express');
var path = require('path');                   
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');            
var admins = require('./routes/admin');            //加载两个路由
var routes = require('./routes/index');           

var app = express();             //express实例

// view engine setup
app.set('views', path.join(__dirname, 'views'));   //设置views视图路径
app.set('view engine', 'jade');                   //设置jade模板引擎

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());     //解析application/json
app.use(bodyParser.urlencoded({ extended: false }));  //// for parsing application/x-www-form-urlencoded
app.use(cookieParser());                            //加载解析cookie的中间件
//app.use(express.static(path.join(__dirname, 'public')));    //托管静态文件

app.use('/admin', admins);
app.use('/',routes);

// catch 404 and forward to error handler    404请求
app.use(function(req, res, next) {          //中间件，没有挂载请求的中间件，所有的请求都会访问该中间件
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {    //注意，错误处理中间件，四个参数必须
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

//-------------------------------------------------------------------------------------------
//静态文件
app.get('/file/:name', function (req, res, next) {

  var options = {
    root: __dirname + '/public/',
    dotfiles: 'deny',
    headers: {
        'x-timestamp': Date.now(),
        'x-sent': true
    }
  };
  var fileName = req.params.name;
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    }
  });

});


var PORT=1499; 
//启动服务
var server = app.listen(PORT, function () {
  console.log('server已经在端口（%s）启动',  server.address().port);
});
module.exports = app;
