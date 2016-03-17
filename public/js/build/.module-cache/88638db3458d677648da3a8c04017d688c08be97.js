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
        console.log(this.state.data1)
      }.bind(this)
    });
  },
  componentDidMount: function() {
      this.loadCommentsFromServer();   
  },
  render: function() {
    return (
      React.createElement("div", {className: "tables"}, 
          React.createElement(Griddle, {results: this.state.data1, tableClassName: "table", showFilter: true, columns: ['uid,fname,ftype,ftablename']}), 
          React.createElement(Griddle, {results: this.state.data2, tableClassName: "table", showFilter: true})
      )   
    );
  }
});

ReactDOM.render(
   React.createElement(LinkedDataTable, null),
   document.getElementById('entity')
);