var mysql  = require('mysql');
var DB=function(config){
	this.config=config||{
		  host     : '127.0.0.1',
          user     : 'zhengzhihao',
          password : '123456',
          database : 'idp'
	}
    this.connection= mysql.createConnection(this.config);
}
//执行查询语句
//todo SQL数据分页
DB.prototype.getTable=function(cmd,params,cb){
    var self=this;
    if (!params) params = [];
    var pnames = cmd.match(/@[a-zA-Z0-9\u4e00-\u9fa5]+/g); if (!pnames) pnames = [];
    if (pnames.length > params.length) {
        cb("需要提供如下参数:" + pnames.slice(params.length).join());
        return;
    }
    var mysqlCmd=cmd.replace(/@[a-zA-Z0-9\u4e00-\u9fa5]+/g,'?');
    var p=[];
    for (var i = 0; i < params.length && pnames.length; i++) { 
        p.push(pnames[i].substring(1),params[i]);
    }
    console.log(mysqlCmd);
    self.connection.query({sql:mysqlCmd,values:p},cb);
}
DB.prototype.getTables = function (params,cb) {
    var that = this;
    var len = params.length;
    var res = new Array(len);
    var finished = 0;
    params.forEach(function (item, idx) {
        if (!item.forEach) {
            item=[item,[]]
        }
        that.getTable.call(that, item[0],item[1], function (err, records) {
            res[idx] = [err, records];
            finished++;
            if (finished >= len) cb(res);
        });
    });
}

DB.prototype.insertEntity=function(cmd,params,cb){
    //返回新插入的id
    var self=this;
    console.log(params);
    if (!params) params = [];
    var pnames = cmd.match(/@_?[a-zA-Z0-9\u4e00-\u9fa5]+/g); if (!pnames) pnames = [];
    if (pnames.length > params.length) {
        cb("需要提供如下参数:" + pnames.slice(params.length).join());
        return;
    }
    var mysqlCmd=cmd.replace(/@_?[a-zA-Z0-9\u4e00-\u9fa5]+/g,'?');
    this.connection.query(mysqlCmd,params,cb);
}

DB.prototype.updateEntity=function(cmd,params,cb){
    var self=this;
    if (!params) params = [];
    var pnames = cmd.match(/@_?[a-zA-Z0-9\u4e00-\u9fa5]+/g); if (!pnames) pnames = [];
    if (pnames.length > params.length) {
        cb("需要提供如下参数:" + pnames.slice(params.length).join());
        return;
    }
    var mysqlCmd=cmd.replace(/@_?[a-zA-Z0-9\u4e00-\u9fa5]+/g,'?');
    this.connection.query(mysqlCmd,params,cb);
}
DB.prototype.deleteEntity=function(cmd,params,cb){
    var self=this;
    if (!params) params = [];
    var pnames = cmd.match(/@_?[a-zA-Z0-9\u4e00-\u9fa5]+/g); if (!pnames) pnames = [];
    if (pnames.length > params.length) {
        cb("需要提供如下参数:" + pnames.slice(params.length).join());
        return;
    }
    var mysqlCmd=cmd.replace(/@_?[a-zA-Z0-9\u4e00-\u9fa5]+/g,'?');
    this.connection.query(mysqlCmd,params,cb);
}

//执行存储过程
DB.prototype.execStoreProcure=function(cmd,params,cb){
    
}

//创建物理表
DB.prototype.createTable=function(params,cb){
    params=params||[];
    var sql="create table "+params.ftablename+"(uid int auto_increment not null primary key)";
    this.connection.query(sql,cb);
}

//重命名表名称
DB.prototype.renameTable=function(params,cb){
    params=params||[];
    var sql="rename table "+params.oldtablename+" to "+params.ftablename;
    console.log(sql);
    this.connection.query(sql,cb);
}

//删除表
DB.prototype.deleteTable=function(params,cb){
    params=params||[];
    var sql="drop table "+params.ftablename;
   
    this.connection.query(sql,cb);
}

/**
 * [addTableColumn 添加表字段]
 * @param {[type]}   params [参数:ftablename：表明]
 * @param {Function} cb     [回掉函数]
 */
DB.prototype.addTableColumn=function(params,cb){
    params=params||[];
    var sql="alter table "+params.ftablename+" add column "+params.fdbname+" "+params.fdatatype;
    if(params.fdefaultvalue!=null&&params.fdefaultvalue!=""){
        switch(params.ftype){
            case 2:case 7:case 8:
                sql+" default value "+params.fdefaultvalue;
                break;
            case 1:case 11:case 4:
                sql+=" default value '"+params.fdefaultvalue+"'";
                break;
        }
        
    }
    if(params.fdescription!=null&&params.fdescription!=""){
        sql+=" comment '"+params.fdescription+"'";
    }

    console.log(sql);
    this.connection.query(sql,cb);
}

/**
 * [alterTableColumn 修改表字段，包括重命名，修改数据类型]
 * @param  {[type]}   params [参数:ftablename:表ming,fdbname:字段名，fdatatype:数据类型，uid:记录id,通过id获取原字段名]
 * @param  {Function} cb     [description]
 * @return {[type]}          [description]
 */
DB.prototype.alterTableColumn=function(params,cb){
    var that = this;
    params=params||[];
    recordCondition={ftablename:"z_entityproperty",uid:params.uid}
    that.getRecord.call(that,recordCondition,function(err,records){
        console.log(records);
        var sql="alter table "+params.ftablename+" change "+records[0]['FDBName']+" "+params.fdbname+" "+params.fdatatype;
        console.log(sql);
        that.connection.query(sql,cb);
    }); 
}


/**
 * [getRecord 获取某表的某一条记录，根据uid]
 * @param  {[type]}   params [参数:ftablename:表名,uid:记录id]
 * @param  {Function} cb     [description]
 * @return {[type]}          [description]
 */
DB.prototype.getRecord=function(params,cb){
    params=params||[];
    var sql="select * from "+params.ftablename+" where uid="+params.uid;
    this.connection.query(sql,cb);
}

/**
 * [getRecordCommonCommon 获取某表的记录]
 * @param  {[type]}   params [参数，注意这里的参数是没有进行属性过滤的，如果需要过滤，请在调用前过滤]
 * @param  {Function} cb     [description]
 * @return {[type]}          [description]
 */
DB.prototype.getRecordsCommon=function(params,cb){
   params=params||[];
   var sql="select * from "+params.ftablename+" where ";
   var where="";
   var values=[];

   for(var key in params){
      if(key!="ftablename"){
         where+=key+"= ? and ";
         values.push(params[key]);
      }
   }

   sql=sql+where.substring(0,where.length-5);
   console.log(sql);
   this.connection.query({sql:sql,values:values},cb);
}

/**
 * [dropTableColumn 删除某表某字段]
 * @param  {[type]}   params [参数:ftablename:表名,fdbname:表字段]
 * @param  {Function} cb     [回掉函数]
 */
DB.prototype.dropTableColumn=function(params,cb){
    params=params||[];
    var sql="ALTER TABLE "+params.ftablename+" DROP "+params.fdbname;
    this.connection.query(sql,cb);
}
module.exports=DB;