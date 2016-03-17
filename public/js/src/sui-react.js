var LiComponent = React.createClass({
	render: function() {
		return (
			<li role="presentation"><a role="menuitem" tabIndex="-1" href="javascript:void(0);"></a>{this.props.data.fname}</li>
		);
	}
});
var ComboxboxComponent = React.createClass({
	getInitialState: function() {
		return {
			data:[],
		};
	},
	loadServerData:function(){
		$.ajax({
			 url: this.props.url,
		     dataType: 'json',
		     success: function(data) {
		       this.setState({data: data});
		     }.bind(this),
		});
	},
	componentDidMount: function() {
		this.loadServerData();
	},
	render: function() {
		 var liComponentList=[];
		for(var i=0;i<this.state.data.length;i=i+1){
			var item=this.state.data[i];
			liComponentList.push(<LiComponent key={i} data={item} />);
		}
		console.log(liComponentList);
		return (
			<div>
				<span className="sui-dropdown dropdown-bordered">
				  <span className="dropdown-inner"><a role="button" data-toggle="dropdown" href="javascript:void(0);" className="dropdown-toggle">请选择...<i className="caret"></i></a>  
				     <ul role="menu" aria-labelledby="drop1" className="sui-dropdown-menu">      
                         {liComponentList}
                     </ul>
                  </span>
                </span>
            </div>
	}
});