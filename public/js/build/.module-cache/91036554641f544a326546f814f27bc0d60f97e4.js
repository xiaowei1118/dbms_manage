var JqGrid = React.createClass({displayName: "JqGrid",
	getDefaultProps: function() {
		return {
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
        console.log(this.props.settings);
		var table=$("#"+this.props.domId).jqGrid({
            //data: this.state.data,
            url:this.props.url,
            datatype: "json",
            colModel: [
                { label: 'ID', name: 'uid', width: 75 },
                { label: '实体名称', name: 'fname', width: 90 },
                { label: '实体类型', name: 'ftype', width: 100 },
                { label: '表名称', name: 'ftablename', width: 80},                 
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

