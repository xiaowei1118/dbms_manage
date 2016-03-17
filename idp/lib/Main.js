var tools = require("./tools.js");
var DB = require("./MySQL.js");
var db = new DB();
var IDP = function (config) {
    config = config || {};
    //配置对象
    this.config = {
        MAX_ENTITY_NUM: 10000, //支持最大实体条目
        MAX_UI_NUM: 10000*4, //支持最大界面条目
        MAX_PROPERTY_NUM:10000*20,//支持最大实体属性条目
    }.extendConfig(config);
    //数据库对象（提供常见数据库操作方法）
    
    this.db=db; 
    //init初始化（IDP实例化时自动执行）
    this.init = function () {
        var self = this;
        //Entity 实体数值（可以根据名称查找）
        self.Entity = new Array(self.config.MAX_ENTITY_NUM);
        //UI 界面
        self.UI = new Array(self.config.MAX_UI_NUM);
        //Property 实体属性 （用于根据属性uid查找属性，用于引用类型所有指向的属性不是uid的情况）
        self.Property = new Array(self.MAX_PROPERTY_NUM);
        //初始化实体及其属性
        db.getTables(["select * from Z_Entity", "select * from Z_EntityProperty"], function (res) {
            var r = res[0]; //第0项查询结果（select * from Z_Entity）
            if (r[0]) { console.dir(r[0]); return; } //查询出错
            r[1].forEach(function (item, idx) { //item为实体对象，idx是记录序号（idx当前没有使用）
                item.FTableName_Org = item.FTableName; //记录原表名
                item.FTableName = item.FTableName.toLowerCase(); //强制转换为小写
                self.Entity[item.uid] = item; //设置uid对应的实体
                self.Entity[item.FTableName] = item; //设置名称（表名）对应的实体
            })
            r = res[1]; //第1项查询结果（select * from Z_EntityProperty）
            if (r[0]) { console.dir(r[0]); return; } //查询出错
            r[1].forEach(function (item, idx) {//item为实体属性对象，idx是记录序号（idx当前没有使用）
                self.Property[item.uid]=item; //实体属性uid对于的实体属性
                var entity = self.Entity[item.FEntityUID];//
                item.FDBName_Org = item.FDBName;
                item.FDBName = item.FDBName.toLowerCase();
                entity.properties = entity.properties || {};
                entity.properties[item.FDBName] = item;
            })
            /*
            r = res[2];
            if (r[0]) { console.dir(r[0]); return; }
            r[1].forEach(function (item, idx) {
                that.UI[item.uid] = item;
                item.entity = that.Entity[FEntityUID];
            })
            */
            console.log("IDP Ready!");
        });
    }
    this.init();
}
/**
 * 根据实体ID和查询字段生成SQL查询语句及相关实体别名
 * @param {int} id  实体id
 * @param {String} fields 查询字段(多个字段采用逗号分隔)
 * @param {[[,,],[,,]]} condition 查询条件[字段,比较方式,内容]
 * @return {Object} {sql:"查询语句（不含where条件",entity:{"小数点分隔的实体路径":"t1 实体别名"}}
 * @api public
 */
IDP.prototype.genSQL = function (id, fields,condition,cb) {
    //转换id为entity，如果entity不存在,则返回。
    if(typeof id === "string")id=id.toLowerCase(); //如果id是字符串强制转换为小写
    var entity = typeof id ==="object" && !!id.FName ? id : this.Entity[id]; 
    
    if (!entity){
        var res={ success: false, message: "找不到实体:" + id };
        if(cb)cb(res);  
        return res;
    }
     
    if(!fields)fields=[];
    //如果fields对象不是数组则采用逗号分隔形成数组.
    if (!fields.forEach) fields = fields.toLowerCase().split(',');
    //根据实体定义重新构建fields
    var sqlfield = "select ";
    var from = " from " + entity.FTableName + " t0 /*" + entity.FName + "*/";
    var where =" where "
    var allField = {};
    var that = this;
    var tableIdx=0; 
    fields.forEach(function (item, idx) {
        var pre = ""; //field前缀
        var preName = "";//field名称前缀
        var lastEntiy = {};//上一个实体
        var currentEntity = entity//当前实体
        var items = item.split(/[._]/);//按照.或者_分隔
        for (var i = 0, len = items.length; currentEntity && i < len; i++) {
            var item = items[i];
            var property=currentEntity.properties[item];
            if (!property) { console.log("找不到属性:" + item); break; }
            if (!allField[pre + item]) { 
                if (i > 0) {
                    tableIdx++;
                    var field='uid';
                    var fieldProperty=that.Property[lastEntiy.property.FEntityPropertyUID];
                    if(fieldProperty)field=fieldProperty.FDBName_Org;
                    from += " left join " + currentEntity.FTableName_Org + " t" + tableIdx + "/*" + currentEntity.FName + "*/ on " + lastEntiy.field + "=t" + tableIdx + "." + field + " ";
                }
                var filedName = "t" + (i > 0 ? tableIdx : 0) + "." + item ;
                sqlfield += filedName+ " as " + pre + item + "/*" + preName + property.FName + "*/,";
                lastEntiy = allField[pre + item] = { field: filedName, entity: currentEntity, property: property };
            } else {
                lastEntiy = allField[pre + item];
            }
            pre += item + "_";
            preName += property.FName + "."
            currentEntity = that.Entity[property.FEntityUID1];
        }
    });
    var res = { sql: sqlfield + "t0.uid " + from, where: " where ", allField: allField, entity: entity, param: [] };
    var entityView=this.genCondition(condition, res); 
    res.where=entityView.where;     
    res.where = res.where.substr(0, res.where.length - 6);
    db.getTable(res.sql+res.where, [], function (err, records) {
        if(cb)cb(err||records);
    })
    return res;
}

/**
 * 生成查询条件 
 * @param {[[,,],[,,]]} condition 查询条件[字段,比较方式,内容] 字段支持'fname,fdescription,fphone'
 * @param {String} param 查询条件
 * @return {Object} {sql:"查询语句（不含where条件",entity:{"小数点分隔的实体路径":"t1 实体别名"}}
 * @api public
 */
IDP.prototype.genCondition = function (condition, entityView) {
    var allField = entityView.allField;          //获取提供的所有的字段域
    var where = entityView.where;
    if (condition && condition.forEach) {
        console.log(condition);
        //当只有一个条件时可以不放在数组中
        //if (!condition[0].forEach) condition = [condition];
        condition.forEach(function (item, idx) {
            var fieldNames = item[0].split(',')
            /*where += "(" +
            fieldNames.filter(function (fieldName) { 
                return !!allField[fieldName]; 
            }).map(function (fieldName) {
                return allField[fieldName].field + " " + item[1] + " '" + item[2] + "'";
            }).join(" or ") + ")  and  ";*/
        where += "(" +
            fieldNames.map(function (fieldName) {
                return fieldName + " " + item[1] + " '" + item[2] + "'";
            }).join(" or ") + ")  and  ";

        });
    }
    var param = entityView.sql.match(/@([a-zA-Z0-9\u4e00-\u9fa5]+)/g);
    if (param) entityView.param = entityView.param.concat(param);
    entityView.where=where;
    return entityView;
}
/**
 * 根据实体视图查询实体数据
 * @param {int} id  实体视图id
 * @param {String} param 查询条件
 * @return {Object} {sql:"查询语句（不含where条件",entity:{"小数点分隔的实体路径":"t1 实体别名"}}
 * @api public
 */
IDP.prototype.getEntity = function (entityView, param) {
    var entity = this.Entity[id];
    if (!entity) return;
    fields.filter(function (item, idx) {
        var items = item.split('.');
        
    });
    if (condition) {

    }
}

IDP.prototype.regOperation = function (operationID,param) { 

}


IDP.prototype.insertEntity=function(id,params,cb){
    var result={};       //返回message
    if(typeof id === "string")id=id.toLowerCase(); //如果id是字符串强制转换为小写
    var entity = typeof id ==="object" && !!id.FName ? id : this.Entity[id]; 
    
    if (!entity){
        var res={ success: false, message: "找不到实体:" + id };
        if(cb)cb(res);  
        return res;
    }

    var sqlfield = "insert ";
    var into = " into " + entity.FTableName;
    var keys=" (";          //插入的字段
    var values=" values (";        //插入的值
    var insertValues=[];
    
    for(var key in params){
       if((typeof(entity['properties'][key])!=='undefined'&&params[key]!="")||(key.substring(0)=="_"&&key.indexOf("time")!=-1)||key=='uid'&&params[key]!=""){     //判断属性是否存在
          keys+=key+",";
          values+="@"+key+",";
          insertValues.push(params[key]);
       }  
    }

    keys+="_ctime,_mtime)";
    values+="@_ctime,@_mtime)";
    insertValues.push(new Date(),new Date());         //将创建时间和修改时间同时放进数据库

    var sql=sqlfield+into+keys+values;               //sql语句

    console.log(sql);
    //如果是实体表，在新增的同时在数据库中创建物理表
    if(entity.FTableName=="z_entity"){
       db.createTable(params,function(err,records){
            if(cb){
                if(err){
                    result.code=0;
                    result.msg="表名已存在,不可重复创建";
                    cb(result);
                }else{
                    //插入操作
                    db.insertEntity(sql,insertValues,function (err, records) {                      
                        if(err){
                           result.code=0;
                           result.msg="添加记录失败";
                        }else{
                           result.code=1;
                           result.msg=records.insertId;
                        }
                        cb(result);
                    });
                }        
            }

       });
    }else if(entity.FTableName=="z_entityproperty"){         //实体属性表在添加数据的时候添加物理字段
       db.addTableColumn(params,function(err,records){
            if(cb){ 
                if(err){
                    console.log(err);
                    result.code=0;
                    result.msg="添加表字段失败";
                    cb(result);
                }else{
                    db.insertEntity(sql,insertValues,function (err, records) {                      
                       if(err){
                          result.code=0;
                          result.msg="添加记录失败";
                       }else{
                          result.code=1;
                          result.msg=records.insertId;
                       }
                       cb(result);
                   });
                }
            }
       }); 
    }else{
        //不需要修改表结构的sql操作
        db.insertEntity(sql,insertValues,function (err, records) {                      
            if(err){
               console.log(err);
               result.code=0;
               result.msg="添加记录失败";
            }else{
               result.code=1;
               result.msg=records.insertId;
            }
            cb(result);
        });
    }

}

IDP.prototype.updateEntity=function(id,params,cb){
    var result={};
    if(typeof id === "string")id=id.toLowerCase(); //如果id是字符串强制转换为小写
    var entity = typeof id ==="object" && !!id.FName ? id : this.Entity[id]; 
    
    if (!entity){
        var res={ success: false, message: "找不到实体:" + id };
        if(cb)cb(res);  
        return res;
    }
     
    var sqlfield = "update ";
    var table =entity.FTableName;
    var where=" where ";
    var set =" set ";
    var values=[];
    var uidvalue;

    for(var key in params){  
        if((typeof(entity['properties'][key])!=='undefined'&&params[key]!="")||(key.substring(0)=="_"&&key.indexOf("time")!=-1)||key=='uid'){     //判断属性是否存在
           if(key=="uid"){              //如果是主键，储存起来
             where+=key+"= @"+key;
             uidvalue=params[key];  
             continue;
           }
           set+=key+"= @"+key+",";     //根据需求拼接sql语句
           values.push(params[key]);
        }    
    } 
    
    set+="_mtime = @_mtime";
    values.push(new Date());     //存放修改时间_mtime
    values.push(uidvalue);       //存放where句式里面的uid
    var sql= sqlfield+table+set+where;

    if(entity.FTableName=="z_entity"){
        db.renameTable(params,function(err,records){
            if(cb){
                if(err){
                    console.log(err);
                    result.code=0;
                    result.msg="重命名表名失败,请检查字段类型转换是否合法";
                    cb(result);
                }else{
                    db.updateEntity(sql,values,function(err,records){
                        if(err){
                            result.code=0;
                            result.msg="更新记录失败";
                        }else{
                            result.code=1;
                            result.msg=records.affectedRows;
                        }
                        cb(result);
                    });
                }
            }
        });
    }else if(entity.FTableName=="z_entityproperty"){
        db.alterTableColumn(params,function(err,records){
            if(cb){
                if(err){
                    console.log(err);
                    result.code=0;
                    result.msg="修改表字段失败";
                }else{
                    db.updateEntity(sql,values,function(err,records){
                        if(err){
                            result.code=0;
                            result.msg="更新记录失败";
                        }else{
                            result.code=1;
                            result.msg=records.affectedRows;
                        }
                        cb(result);
                    });
                }
            }
        });
    }else{
        db.updateEntity(sql,values,function(err,records){
            if(err){
                result.code=0;
                result.msg="更新记录失败";
                console.log(err);
            }else{
                result.code=1;
                result.msg=records.affectedRows;
            }
            cb(result);
        });
    }
    
}

IDP.prototype.deleteEntity=function(id,params,cb){
    var result={};
    if(typeof id === "string")id=id.toLowerCase(); //如果id是字符串强制转换为小写
    var entity = typeof id ==="object" && !!id.FName ? id : this.Entity[id]; 
    
    if (!entity){
        var res={ success: false, message: "找不到实体:" + id };
        if(cb)cb(res);  
        return res;
    }

    var sqlfield="delete from ";
    var table =entity.FTableName;
    var where=" where ";
    var values=[];
    
    for(var key in params){

       if((typeof(entity['properties'][key])!=='undefined'&&params[key]!=""&&params[key]!=null)||(key.substring(0)=="_"&&key.indexOf("time")!=-1)||key=='uid'){     //判断属性是否存在 
           where+=key+"= @"+key+" and ";
           values.push(params[key]);
       }
    }
    where=where.substring(0,where.length-4); 
    var sql = sqlfield+table+where;               //执行的sql语句

    if(entity.FTableName=="z_entity"){
        db.deleteTable(params,function(err,records){
            if(cb){
                if(err){
                    console.log(err);
                    result.code=0;
                    result.msg="删除数据表失败";
                    cb(result);
                }else{
                    db.deleteEntity(sql,values,function (err, records) {     //values为参数
                        if(err){
                            result.code=0;
                            result.msg="删除记录失败";
                        }else{
                            //删除表后删除它的属性表记录
                            var propertyDelSql="delete from Z_EntityProperty where FEntityUID="+params['uid'];
                            db.deleteEntity(propertyDelSql,[],function(err,records){
                                if(err){
                                    result.code=0;
                                    result.msg="删除数据表失败";
                                    cb(result);
                                }else{
                                    result.code=1;
                                    result.msg="删除记录成功";
                                    cb(result);
                                }
                               
                            });
                        }
                    });
                }
            }
           
        });     
    }else if(entity.FTableName=="z_entityproperty"){
        db.dropTableColumn(params,function(err,records){
            if(cb){
                if(err){
                    console.log(err);
                    result.code=0;
                    result.msg="删除表字段失败";
                    cb(result);
                }else{
                     db.deleteEntity(sql,values,function (err, records) {     //values为参数
                        if(err){
                            result.code=0;
                            result.msg="删除记录失败";
                        }else{
                            result.code=1;
                            result.msg="删除记录成功";
                        }
                        cb(result);
                    });
                }
            }
        });
    }else{
        db.deleteEntity(sql,values,function (err, records) {     //values为参数
            if(err){
                result.code=0;
                result.msg="删除记录失败";
            }else{
                result.code=1;
                result.msg="删除记录成功";
            }
            cb(result);
        });
    }
}

/*处理查询时提供的查询条件 _field=fname,ftype&uid=1&fname=hello  其中uid和name即为查询条件
*@param params 传递过来的参数值
*@return [[uid,=,1],[ftype,=,1],[fname,'like','hello']] 返回参数数组
*/
IDP.prototype.genWhere=function(params,id){
    if(typeof id === "string")id=id.toLowerCase(); //如果id是字符串强制转换为小写
    var entity = typeof id ==="object" && !!id.FName ? id : this.Entity[id]; 
    
    if (!entity){
        var res={ success: false, message: "找不到实体:" + id };
        if(cb)cb(res);  
        return res;
    }
   var arr=[];
   for(var key in params){
       var keys=key.split(",");        //参数有多个参数用逗号隔开的方式
       for(var vo of keys){
           var item=[];
           var val;
           if((vo.substring(0)=="_"&&vo!='_field')||vo=='uid'||(typeof(entity['properties'][vo])!=='undefined'&&params[key]!="")){     //判断属性是否存在 
              console.log(params[key]);
              if(params[key].indexOf('%')!=-1){
                item.push(vo,"like",params[key]);
              }else if(params[key].indexOf('!')!=-1){
                val=params[key].substring(1);
                item.push(vo,"!=",val);
              }else if(params[key].indexOf(">")!=-1&&params[key].indexOf(">=")===-1){
                val=params[key].substring(1);
                item.push(vo,">",val);
              }else if(params[key].indexOf(">=")!=-1){
                val=params[key].substring(2);
                item.push(vo,">=",val);
              }else if(params[key].indexOf("<")!=-1&&params[key].indexOf("<=")===-1){
                val=params[key].substring(1);
                item.push(vo,"<",val);
              }else if(params[key].indexOf("<=")!=-1){
                val=params[key].substring(2);
                item.push(vo,"<=",val);
              }else{
                item.push(vo,"=",params[key]);
              }
            
              arr.push(item);
           }
       };      
    }
   return arr;
}

IDP.prototype.getFieldWithQuote=function(id,params,cb){
    var that=this;
    var res;
    if(typeof id === "string")id=id.toLowerCase(); //如果id是字符串强制转换为小写
    var entity = typeof id ==="object" && !!id.FName ? id : this.Entity[id]; 
    
    if (!entity){
        res={ success: false, message: "找不到实体:" + id };
        if(cb)cb(res);  
        return res;
    }
    
    var fields="fname,fdbname,ftype,fentityuid1";
    var condition=[['fentityuid','=',params.uid]];
    that.genSQL.call(that,id,fields,condition,function(records){
            var tree=[];        
            for(var key in records){
                var item={id:records[key]['uid'],text:records[key]['fname'],attributes:{fdbname:records[key]['fdbname'],ftype:records[key]['ftype'],fentityuid1:records[key]['fentityuid1']}};
                if(records[key]['ftype']==8){
                    item['children']=[{id:0}];
                    item['state']="closed";
                }
                tree.push(item);        //构造easyui需要的tree数据
            }
            cb(tree);
    });
    return;  
}

/**
 * [createApi 添加接口]
 * @param  {[type]}   params [参数]
 * @param  {Function} cb     [回调]
 * @return {[type]}          
 */
IDP.prototype.createApi=function(params,cb){
    var that=this;
    var con=[];
    if(typeof params['where_field']=="string"&&params['where_field'].trim()!=""){     //如果是字符串类型直接扔进去
        var item={field:params['where_field'],type:params['where_type'],value:params['where_value']};
        con.push(item);
    }else if(typeof params['where_field']!="string"){           //数组遍历
        for(var i=0;i<params['where_field'].length;i=i+1){
            if(params['where_field'][i].trim()=='')continue;          //字段不能为空
            var item={field:params['where_field'][i],type:params['where_type'][i],value:params['where_value'][i]};
            con.push(item);
        }
    }
    
    params.fcondition=JSON.stringify(con);
    delete params['uid'];   //让id自增
    that.insertEntity.call(that,'z_api_config',params,function(data){    
        if(cb){
            cb(data);                          
        }
    });
}

/**
 * [updateApi 更新api]
 * @param  {[type]}   params [参数]
 * @param  {Function} cb     [回调]
 * @return {[type]}          []
 */
IDP.prototype.updateApi=function(params,cb){
    var that=this;
    var con=[];
    if(typeof params['where_field']=="string"&&params['where_field'].trim()!=""){     //如果是字符串类型直接扔进去
        var item={field:params['where_field'],type:params['where_type'],value:params['where_value']};
        con.push(item);
    }else if(typeof params['where_field']!="string"){           //数组遍历
        for(var i=0;i<params['where_field'].length;i=i+1){
            if(params['where_field'][i].trim()=='')continue;
            var item={field:params['where_field'][i],type:params['where_type'][i],value:params['where_value'][i]};
            con.push(item);
        }
    }
    
    params.fcondition=JSON.stringify(con);

    that.updateEntity.call(that,'z_api_config',params,function(data){    
        if(cb){
            cb(data);      
        }
    });
}

/**
 * [handleApi 处理接口]
 * @param  {[type]}   path   [api接口名称，包含在路径中]
 * @param  {[type]}   params [参数]
 * @param  {Function} cb     [回调函数]
 * @return {[type]}
 */
IDP.prototype.handleApi=function(path,params,cb){
    var result;
    var that=this;
    if(!!path){
        var query={ftablename:'z_api_config',fname:path};
        db.getRecordsCommon(query,function(err,records){     //获取这条api记录
            if(err){
                result={code:'0',msg:"404 Not Found"};
                cb(result);
            }else{
                if(records[0]['FStatus']==0){
                    cb({code:0,msg:"该接口已经禁用"});
                    return;
                }
               //操作api接口参数，通过api获取数据并返回
               var ApiFields=eval("("+records[0]['FField']+")");        //api规定字段
               var ApiCondition=eval("("+records[0]['FCondition']+")");           //api约束
               if(typeof params._field)params._field="";
               var paramFields=params._field.split(",");         

               var where=that.genWhere.call(that,params,that.Entity[records[0]['FFrom'].toLowerCase()]);

               var condition=[];
               //检查         
               for(var paramField of paramFields){
                 var tag=0;
                 for(var apiField of ApiFields){
                    if(paramField.toLowerCase()==apiField.toLowerCase()){
                        tag=1;
                    }
                 }
                 if(tag==0&&paramField!==""){
                    cb({code:0,msg:"查询的字段已超出约束"});
                    return;
                 }
               }

               //检查前台调用的条件参数是否符合约束
               for(var item of ApiCondition){
                 var con=[];
                 con.push(item['field']);
                 con.push(item['type']);
                 con.push(item['value']);
                 var flag=0;
                 for(var vo of where){
                    if(vo[0]==con[0]&&vo[1]==con[1]){
                        if(con[2].trim()==""){
                            condition.push(con);
                            flag=1;
                        }else{
                            if(con[2]==vo[2]){
                                condition.push(con);
                                flag=1;
                            }
                        }
                    }
                 }
                 if(flag===0){
                    var result={code:0,msg:"接口参数不符合要求"};
                    cb(result);
                    return;
                 }
               }
            
              console.log(condition);
              that.genSQL.call(that,records[0]['FFrom'],params._field,condition,function(data){
                     cb(data);
                     return;
              });
              
            }
        });
    }
}
module.exports = IDP;