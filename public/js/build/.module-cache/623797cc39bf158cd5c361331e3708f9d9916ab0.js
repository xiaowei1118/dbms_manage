var settings={
	width:"400px",
	pager: "#jqGridPager",
	caption:"实体表"
}
ReactDOM.render(
	React.createElement(JqGrid, {url: "/get/z_entity?_field=fname,ftype,ftablename", domId: "jqGrid", height: settings.height, width: settings.width, pager: settings.pager}),
	document.getElementById('jqGrid')
);