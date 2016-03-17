var setDefaultMixIn={
    getDefaultProps: function() {
        return {
            url: "",
            datatype: "json",
            data:[],
            loadonce: true,
            multiSort: false,
            width: 780,
            height: 600,
            rowNum: 15,
            viewrecords: true,
            pager: "#jqGridPager",
            caption: "",
            colModel:[],
        };
    },
}
var JqGrid = React.createClass({displayName: "JqGrid",
	mixins:[setDefaultMixIn],
    getInitialState: function() {
      return {
          data: [],
      };
    },
    loadDataFromServer:function(){
        console.log(this.props.url);
        $.ajax({
            url:this.props.url,
            datatype:"json",
            data:[],
            success:function(data){
                this.setState({data:data});
            }
        });
    },
    getColModel:function(){

    },
    componentDidMount: function() {
      this.loadDataFromServer();   
    },
	render: function() {
		var table=$("#"+this.props.domId).jqGrid({
            //data: this.state.data,
            url:this.props.url,
            datatype: "json",
            colModel:this.props.colModel,
            loadonce: this.props.loadonce,
            multiSort: this.props.multiSor,
            width: this.props.width,
            height: this.props.height,
            rowNum: this.props.rowNum,
			viewrecords: this.props.viewrecords,
            pager: this.props.pager,
            caption: this.props.caption,
        }); 
		return (
			React.createElement("div", {className: "JqGrid"}, 
				table
			)
		);
	}
});

