var LinkedDataTable = React.createClass({displayName: "LinkedDataTable",
   getInitialState: function() {
        return {
            data1: [],
            data2: []
        };
  },
  loadCommentsFromServer:function(){        //获取服务端数据
    $.ajax({
      url:"/get/z_entity?_field=fname,ftype,ftablename&ftype=1",
      data:{},
      success:function(data){
        console.log(data);
        this.setState({data1:data,data2:[]});
        console.log(this.states.data1)
      }.bind(this)
    });
  },
  componentDidMount: function() {
      this.loadCommentsFromServer();   
  },
  render: function() {
    return (
      React.createElement("div", {className: "tables"}, 
          React.createElement(Griddle, {results: this.props.data1, showFilter: true}), 
          React.createElement(Griddle, {results: this.props.data2, showFilter: true})
      )   
    );
  }
});

ReactDOM.render(
   React.createElement(LinkedDataTable, null),
   document.getElementById('entity')
);