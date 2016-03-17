var LiComponent = React.createClass({
	displayName: "LiComponent",

	render: function () {
		return React.createElement(
			"li",
			{ role: "presentation" },
			React.createElement("a", { role: "menuitem", tabIndex: "-1", href: "javascript:void(0);" }),
			this.props.data.fname
		);
	}
});
var ComboxboxComponent = React.createClass({
	displayName: "ComboxboxComponent",

	getInitialState: function () {
		return {
			data: []
		};
	},
	loadServerData: function () {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: (function (data) {
				this.setState({ data: data });
			}).bind(this)
		});
	},
	componentDidMount: function () {
		this.loadServerData();
	},
	render: function () {
		var liComponentList = [];
		for (var i = 0; i < this.state.data.length; i = i + 1) {
			var item = this.state.data[i];
			liComponentList.push(React.createElement(LiComponent, { key: i, data: item }));
		}
		console.log(liComponentList);
		return React.createElement(
			"div",
			{ className: "comboxbox" },
			React.createElement(
				"span",
				{ className: "sui-dropdown dropdown-bordered" },
				React.createElement(
					"span",
					{ className: "dropdown-inner" },
					React.createElement(
						"a",
						{ role: "button", "data-toggle": "dropdown", href: "javascript:void(0);", className: "dropdown-toggle" },
						"请选择...",
						React.createElement("i", { className: "caret" })
					),
					React.createElement(
						"ul",
						{ role: "menu", "aria-labelledby": "drop1", className: "sui-dropdown-menu" },
						liComponentList
					)
				)
			)
		);
	}
});