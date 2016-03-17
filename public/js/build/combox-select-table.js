var url = "/get/z_entity?_field=fname";

var comboxboxComponent = React.createClass({
	displayName: "comboxboxComponent",

	/*getInitialState: function() {
 	return {
 		data:[],
 	};
 },
 loadServerData:function(){
 	console.log(this.props.url);
 	$.ajax({
 		 url: this.props.url,
 	     dataType: 'json',
 	     success: function(data) {
 	       this.setState({data: data});
 	     }.bind(this),
 	});
 },
 componentDidMount: function() {
 	console.log("hehe");
 	this.loadServerData();
 },*/
	render: function () {
		//var liComponentList=[];
		/*for(var item in this.state.data){
  	liComponentList.push(<li role="presentation" data-id="{item.uid}"><a role="menuitem" tabindex="-1" href="javascript:void(0);">{item.fname}</a></li>);
  }*/
		return React.createElement(
			"div",
			{ className: "comboxbox" },
			"我日你个"
		);
	}
});

ReactDOM.render(React.createElement("comboxboxComponent", { url: url }), document.getElementById('comboxbox-table'));