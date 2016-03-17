var JqGrid = React.createClass({displayName: "JqGrid",
	getDefaultProps: function() {
		return {
            settings:
            {
            url: "",
            datatype: "json",
            loadonce: true,
            multiSort: false,
            width: 780,
            height: 600,
            rowNum: 15,
			viewrecords: true,
            pager: "#jqGridPager",
            caption: ""
            }
		};
	},
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
      //this.loadDataFromServer();   
    },
	render: function() {
		var table=$("#"+this.props.domId).jqGrid({
            //data: this.state.data,
            url:this.props.url,
            datatype: "json",
            colModel: [
                { label: '分类名称', name: 'CategoryName', width: 75 },
                { label: '产品名称', name: 'ProductName', width: 90 },
                { label: '国家', name: 'Country', width: 100 },
                { label: '价格', name: 'Price', width: 80, sorttype:'number' },
                { label: '质量', name: 'Quantity', width: 80, sorttype:'integer' }                   
            ],
            loadonce: this.props.settings.loadonce,
            multiSort: this.props.settings.multiSor,
            width: this.props.settings.width,
            height: this.props.settings.height,
            rowNum: this.props.settings.rowNum,
			viewrecords: this.props.settings.viewrecords,
            pager: this.props.settings.pager,
            caption: this.props.settings.caption,
        }); 
		return (
			React.createElement("div", {className: "JqGrid"}, 
				table
			)
		);
	}
});

ReactDOM.render(
    //../get/z_enum?_field=fname,ftype,ftablename
	React.createElement(JqGrid, {url: "../data/data.json", domId: "jqGrid"}),
	document.getElementById('jqGrid')
);