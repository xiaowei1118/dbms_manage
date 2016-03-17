var LinkedDataTable = React.createClass({displayName: "LinkedDataTable",
   getInitialState: function() {
        return {
            data1: [],
            data2: []
        };
  },
  loadCommentsFromServer:function(){        //获取服务端数据
    $.ajax({
      url:"/get/z_entity?_field=fname,ftype,ftablename,uid&ftype=1",
      data:{},
      dataType:"json",
      success:function(data){
        console.log(data);
        this.setState({data1:data,data2:[]});
        console.log(this.state.data1);
      }.bind(this)
    });
  },
  changeTable2DataFromServer:function(id){
    $.ajax({
      url:"/get/z_entityproperty?_field=fname,ftype,fdbname,uid&fentityuid="+id,
      data:{},
      dataType:"json",
      success:function(data){
  
        this.setState({data2:data});
      }.bind(this)
    });
  },
  table1rowclick:function(data){
      this.changeTable2DataFromServer(data.props.data.uid);
  },
  componentDidMount: function() {
      this.loadCommentsFromServer();   
  },
  render: function() {
    return (
      React.createElement("div", {className: "tables"}, 
          React.createElement(Griddle, {results: this.state.data1, tableClassName: "table1", showFilter: true, columns: ['uid','fname','ftype','ftablename'], onRowClick: this.table1rowclick}), 
          React.createElement("br", null), 
          React.createElement(Griddle, {results: this.state.data2, tableClassName: "table2", showFilter: true, columns: ['uid','fname','ftype','fdbname']})
      )   
    );
  }
});

ReactDOM.render(
   React.createElement(LinkedDataTable, null),
   document.getElementById('entity')
);