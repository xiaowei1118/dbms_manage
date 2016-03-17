ReactDOM.render(
	React.createElement(JqGrid, {url: "/get/z_entity?_field=fname,ftype,ftablename", domId: "jqGrid"}),
	document.getElementById('jqGrid')
);