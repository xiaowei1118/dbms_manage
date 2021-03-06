/**
 * 联动表格控件
 * 这个控件共需要四个参数，表格1的url以及链接字段，表格2的url以及链接字段                                          [description]
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
        this.setState({data1:data});
      }.bind(this)
    });
  },
  changeTable2DataFromServer:function(id){
    $.ajax({
      url:this.props.data.url2+"&"+this.props.data.url2_link_id+"="+id,         //获取联动表格数据
      data:{},
      dataType:"json",
      success:function(data){
        if(typeof data==Array)data=[];
        this.setState({data2:data});        //更新联动表格的数据
      }.bind(this)
    });
  },
  table1rowclick:function(e){
      var id=this.props.data.url1_link_id;
      var data=e.props.data;                            //行记录数据
      this.changeTable2DataFromServer(data[id]);        //根据行记录id获取第二个表格的数据集
  },
  componentDidMount: function() {
      this.loadCommentsFromServer();   
  },
  render: function() {
    return (
      React.createElement("div", {className: "tables"}, 
          React.createElement(Griddle, {results: this.state.data1, tableClassName: "table", showFilter: true, showSettings: "true", columns: ['uid','fname','ftype','ftablename'], onRowClick: this.table1rowclick, filterPlaceholderText: "搜索"}), 
          React.createElement("br", null), 
          React.createElement(Griddle, {results: this.state.data2, tableClassName: "table", showFilter: true, showSettings: "true", columns: ['uid','fname','ftype','fdbname'], noDataMessage: ""})
      )   
    );
  }
});



