/**
 * 这个空间共需要四个参数，表格1的url以及链接字段，表格2的url以及链接字段
 * @param  {[type]} )                                         {                                                                   return {                                                                                                                         data1:       [],                                            data2: []        };  } [description]
 * @param  {[type]} loadCommentsFromServer:function(){                                                                                                                                            $.ajax({                   url:this.props.url1,                                              data:{} [description]
 * @param  {[type]} dataType:"json"                           [description]
 * @param  {[type]} success:function(data){                                               this.setState({data1:data,data2:[]});                                                                            }.bind(this)    });                 } [description]
 * @param  {String} changeTable2DataFromServer:function(id){                 $.ajax({                                                   url:this.url2+"&"+this.props.url2_link_id+" [description]
 * @param  {[type]} dataType:"json"                           [description]
 * @param  {[type]} success:function(data){                                               this.setState({data2:data});                                                                                                                                            }.bind(this [description]
 * @return {[type]}                                           [description]
 */
var LinkedDataTable = React.createClass({displayName: "LinkedDataTable",
   getInitialState: function() {
        return {
            data1: [],
            data2: []
        };
  },
  loadCommentsFromServer:function(){        //获取服务端数据
    console.log(this.props.data);
    $.ajax({
      url:this.props.data.url1,
      data:{},
      dataType:"json",
      success:function(data){
        this.setState({data1:data,data2:[]});
      }.bind(this)
    });
  },
  changeTable2DataFromServer:function(id){
    $.ajax({
      url:this.props.data.url2+"&"+this.props.data.url2_link_id+"="+id,         //获取联动表格数据
      data:{},
      dataType:"json",
      success:function(data){
        this.setState({data2:data});        //更新联动表格的数据
      }.bind(this)
    });
  },
  table1rowclick:function(data){
      var id=this.props.data.url1_link_id;
      this.changeTable2DataFromServer(data.props.data.id);        //根据行记录id获取第二个表格的数据集
  },
  componentDidMount: function() {
      this.loadCommentsFromServer();   
  },
  render: function() {
    return (
      React.createElement("div", {className: "tables"}, 
          React.createElement(Griddle, {results: this.state.data1, tableClassName: "table1", showFilter: true, columns: ['uid','fname','ftype','ftablename'], onRowClick: this.table1rowclick}), 
          React.createElement("br", null), 
          React.createElement(Griddle, {results: this.state.data2, tableClassName: "table2", showFilter: true, columns: ['uid','fname','ftype','fdbname'], noDataMessage: ""})
      )   
    );
  }
});



