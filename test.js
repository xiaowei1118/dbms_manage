/*!
 * IDP Server 2.0
 * Copyright(c) 2015-2016 Andrew GU
 * MIT Licensed
 */
//require('http').globalAgent.maxSockets = 40000;
//require('https').globalAgent.maxSockets = 40000;
var express = require('express'); //引用Express框架
var bodyParser = require("body-parser"); //读取form参数
var app = express(); //初始化Express
var IDP=require('./idp/lib/Main.js');//引用IDP主文件
var idp=new IDP();//初始化IDP
var path = require('path');
var admins = require('./routes/admin');            //加载两个路由
var swig=require('swig');

var connectionList={};
app.use(bodyParser.urlencoded({ extended: false })); //采用bodyParser读取form参数
app.use(express.static(path.join(__dirname, 'public')));    //托管静态文件

app.engine('html',swig.renderFile);                 //使用swig模板引擎代替jade
app.set('views', path.join(__dirname, 'views'));   //设置views视图路径
app.set('view engine', 'html');

app.use('/admin',admins);

//-------------------------------------------------------------------------------------------
//根据现有api限制查询数据
app.use('/api/*',function(req,res){
   res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8'});
   var param=extend({},req.body,req.query);
   var path=req.params[0];
   idp.handleApi(path,param,function(data){
       res.end(JSON.stringify(data));
   })
});

//查询数据
app.use('/get/*', function (req, res) {
  handle(req, res,function(err,context){
    if(err){
      context.res.end(JSON.stringify(err));
      return;
    }
    if(!!context.entity){
        var where=idp.genWhere(context.param,context.entity);
        idp.genSQL(context.entity,context.param._field,where,function(data){
          context.res.end(JSON.stringify(data));
        })
      }else{
        if(context.path=='addconn'){
          connectionList[context.param.id]=context;
        }else if(context.path=='listconn'){
          context.res.end(connectionList.length);
        }else if(context.path=='endconn'){
          var mycontext=connectionList[context.param.id];
          if(mycontext && mycontext.res)mycontext.res.end(context.param.msg);
          else console.log(context.param);
          context.res.end();
        }else{
          context.res.end();
        }
        console.log({path:context.path,param:context.param})
      }

  })
});

//-------------------------------------------------------------------------------------------
//新增数据
app.use('/add/*', function (req, res) {
 handle(req, res,function(err,context){
    if(err){
      context.res.end(JSON.stringify(err));
      return;
    }
    if(!!context.entity){
      idp.insertEntity(context.entity,context.param,function(data){
         context.res.end(""+JSON.stringify(data));         //返回插入数据的id
      });
    }
  })
});

//-------------------------------------------------------------------------------------------
//修改数据
app.use('/update/*', function (req, res) {
 handle(req, res,function(err, context){
    if(err){
      context.res.end(JSON.stringify(err));
      return;
    }
    if(!!context.entity){
      idp.updateEntity(context.entity,context.param,function(data){
         context.res.end(""+JSON.stringify(data));    //返回影响的记录的行数,data没有获取更新id的属性
      });
    }
  })
});

//-------------------------------------------------------------------------------------------
//删除数据
app.use('/delete/*', function (req, res) {
  handle(req, res,function(err,context){
    if(err){
      context.res.end(JSON.stringify(err));
      return;
    }
    if(!!context.entity){
      idp.deleteEntity(context.entity,context.param,function(data){
        context.res.end(""+JSON.stringify(data));    //返回影响的记录的行数
      });
    }
  })
});

//-------------------------------------------------------------------------------------------
//通用处理方法（正常业务之前先调用此方法）
var handle=function(req,res,cb){
  var err=null;
  //设置返回类型及字符集（此处如果不指明charset为utf-8，中文会显示乱码）
  res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8'});
  //获取path并转为小写
  var path= req.params[0].toLowerCase();
  //准备上下文数据
  var context={
    req:req, //HTTP请求对象
    res:res, //HTTP应答对象
    param:extend({},req.body,req.query),//form及query数据
    form:req.body,//form数据
    query:req.query,//query数据
    path:path,//路径
    entity:null,//实体对象
    fun:null//方法对象
  }
  //初始化实体（context.entity）和功能（context.fun）
  if(path.indexOf('/')>0){
    context.fun=path;//待修改
  }else{
    context.entity=idp.Entity[path];//初始化entity对象
    //如果实体找不到提示保存信息
    if(!context.entity) err={success:false,message:"找不到实体["+req.params[0]+"]",code:ErrorCode.idp_0001_找不到实体};
  }
  //处理回掉函数
  if(cb)cb(err,context);
  //console.log(context.param);
  return;
}

//-------------------------------------------------------------------------------------------
//静态文件         在public中有文件夹时不可用，可直接使用express的static方法
// app.get('/file/:name', function (req, res, next) {

//   var options = {
//     root: __dirname + '/public/',
//     dotfiles: 'deny',
//     headers: {
//         'x-timestamp': Date.now(),
//         'x-sent': true
//     }
//   };
//   var fileName = req.params.name;
//   res.sendFile(fileName, options, function (err) {
//     if (err) {
//       console.log(err);
//       res.status(err.status).end();
//     }
//   });

// })

//-------------------------------------------------------------------------------------------
//定义服务端口（李总座机后四位）
var PORT=1499;
//启动服务
var server = app.listen(PORT, function () {
  console.log('IDP Server（HTTP）已经在端口（%s）启动',  server.address().port);
});

//-------------------------------------------------------------------------------------------
//合并对象
var extend=function (target) {
    var sources = [].slice.call(arguments, 1);
    sources.forEach(function (source) {
        for (var prop in source) {
            target[prop] = source[prop];
        }
    });
    return target;
}
//错误码定义
var ErrorCode={
  idp_0001_找不到实体:"idp_0001"
}
