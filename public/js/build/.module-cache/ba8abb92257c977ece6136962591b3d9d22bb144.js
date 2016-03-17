var LinkedDataTableModule=function(){
    var LinkedDataTable = React.createClass({displayName: "LinkedDataTable",
       getInitialState: function() {
            return {
                data1: [],
                data2: []
            };
      },
      loadCommentsFromServer:function(){        //获取服务端数据
        $.ajax({
          url:this.url1,
          data:{},
          dataType:"json",
          success:function(data){
            this.setState({data1:data,data2:[]});
          }.bind(this)
        });
      },
      changeTable2DataFromServer:function(id){
        $.ajax({
          url:this.url2+"&"+this.url2_link_id+"="+id,
          data:{},
          dataType:"json",
          success:function(data){
            this.setState({data2:data});
          }.bind(this)
        });
      },
      table1rowclick:function(data){
          this.changeTable2DataFromServer(data.props.data.url1_link_id);        //根据行记录id获取第二个表格的数据集
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

    ReactDOM.render(
       React.createElement(LinkedDataTable, null),
       document.getElementById('entity')
    );
}
LinkedDataTableModule.prototype.initData = function(url1,url1_link_id,url2,url2_link_id) {
  
};

