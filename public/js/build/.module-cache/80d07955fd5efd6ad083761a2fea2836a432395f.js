/**
 * 控件需要url参数
 * 表格控件，获取远程数据
 */
var DataTable = React.createClass({displayName: "DataTable",
  getInitialState: function() {
      return {
          data: [],
      };
  },
  loadCommentsFromServer:function(){        //获取服务端数据
    $.ajax({
      url:this.props.data.url,
      data:{},
      dataType:"json",
      success:function(data){
        this.setState({data:data});
      }.bind(this)
    });
  },
  componentDidMount: function() {             //在控件加载完后调用
      this.loadCommentsFromServer();   
  },
  render: function() {
    return (
      React.createElement("div", {className: "DataTable"}, 
         React.createElement(Griddle, {results: this.state.data, showFilter: true, showSettings: true})
      )
    );
  }
});

/**
 * 联动表格控件
 * 这个控件共需要四个参数，表格1的url以及链接字段，表格2的url以及链接字段                                          [description]
 */
var LinkedDataTable = React.createClass({displayName: "LinkedDataTable",
  getDefaultProps: function() {
    return {
        showSettings1:true,
        showFilter1:true,
        showSettings2:true,
        showFilter2:true,
        noDataMessage:""
    };
  },
   getInitialState: function() {
        return {
            data1: [],
            data2: []
        };
  },
  loadCommentsFromServer:function(){        //获取服务端数据
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
      React.createElement("div", {className: "linkTables"}, 
          React.createElement(Griddle, {results: this.state.data1, columnMetadata: this.props.table1ColumnsMetas, showFilter: this.props.showFilter1, showSettings: this.props.showSettings1, columns: ['uid','fname','ftype','ftablename'], onRowClick: this.table1rowclick, filterPlaceholderText: "搜索", settingsText: "设置"}), 
          React.createElement(Griddle, {results: this.state.data2, columnMetadata: this.props.table2ColumnsMetas, showFilter: this.props.showFilter2, showSettings: this.props.showSettings2, columns: ['uid','fname','ftype','fdbname'], noDataMessage: "", filterPlaceholderText: "搜索", settingsText: "设置"})
      )   
    );
  }
});



