var express = require('express');
var router = express.Router();
var IDP=require('../idp/lib/Main.js');//引用IDP主文件
var idp=new IDP();//初始化IDP

/*根据记录中的状态一次性更新数据*/
router.post('/onceEdit/*',require('body-parser').json(),function(req, res, next) {
	res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8'});
	var params=req.body;
	var entity=idp.Entity[req.params[0]];//初始化entity对象

	if(!!entity){
		params.forEach(function(item){
			switch(item['action']){
				case 'deleted':         //删除
					 idp.deleteEntity(entity,item,function(data){
				        res.end(""+JSON.stringify(data));    //返回影响的记录的行数
				      });
					 break;
				case 'updated':          //更新
				 	 idp.updateEntity(entity,item,function(data){
				 	    res.end(""+JSON.stringify(data));    //返回影响的记录的行数,data没有获取更新id的属性
				 	 });
				 	 break;
				case 'inserted':         //插入
					 idp.insertEntity(entity,item,function(data){
					    res.end(""+JSON.stringify(data));         //返回插入数据的id
					 });
					 break;
			}
		});
	}else{
		res.end('操作的实体表不存在');
	}
	
});


/**
 * 获取某表字段以及其引用表字段
 * @param  {[type]} req                                           
 * @param  {[type]} res
 * @return {[type]}                                               
 */
router.all('/getFieldWithQuote/*',function(req,res){
	handle(req,res,function(err,context){
 		if(err){
 		  context.res.end(JSON.stringify(err));
 		  return;
 		}

 		if(!!context.entity){
 		  idp.getFieldWithQuote(context.entity,context.param,function(data){
 		    context.res.end(""+JSON.stringify(data));    
 		  });
 		}
	});
});

router.all('/api/*',function(req,res){
	res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8'});
	var param=extend({},req.body,req.query);
	
	if(param.uid==0){
		//新增接口
		idp.createApi(param,function(data){
			res.end(""+JSON.stringify(data));
		});
	}else{
		//编辑接口
		idp.updateApi(param,function(data){
			res.end(""+JSON.stringify(data));
		});
	}
	
});

router.all('/getApiField',function(req,res){
	res.writeHead(200, { 'Content-Type': 'text/plain;charset=utf-8'});
	var param=extend({},req.body,req.query);
	var where=idp.genWhere(param,"z_api_field");

    idp.genSQL('z_api_field',param._field,where,function(data){
      var result=JSON.stringify(data[0]['ffieldtree']);
      result=result.replace(/\\/g,"");
      result=result.substr(1,result.length-2);     
      res.end(result);
    })
});

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

module.exports = router;