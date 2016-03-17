var sql = require('mssql'); 
var DB=function(config){
	this.config=config||{
		user: 'sa',
		password: 'at89c51',
		server: '127.0.0.1', // You can use 'localhost\\instance' to connect to named instance
		database: 'IDP',
	}
}
DB.prototype.getTable=function(cmd,params,cb){
	var connection = new sql.Connection(this.config, function (err) {
        var request = new sql.Request(connection);
        if (!params) params = [];
        var pnames = cmd.replace(/@@/g).match(/@[a-zA-Z0-9\u4e00-\u9fa5]+/g); if (!pnames) pnames = [];
        if (pnames.length > params.length) {
            cb("需要提供如下参数:" + pnames.slice(params.length).join());
            return;
        }
        for (var i = 0; i < params.length && pnames.length; i++) { 
            request.input(pnames[i].substring(1),params[i]);
        }
		request.query(cmd,cb);
	});
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
        })
    });
}
module.exports=DB;