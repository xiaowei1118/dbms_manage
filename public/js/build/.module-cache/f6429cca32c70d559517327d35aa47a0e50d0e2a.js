var settings={
	width:"500px",
	height:"600px",
	pager: "#jqGridPager",
	caption:"实体表"
}
var colModel=[
    { label: 'ID', name: 'uid', width: 75 },
    { label: '实体名称', name: 'fname', width: 90 },
    { label: '实体类型', name: 'ftype', width: 80 },
    { label: '表名称', name: 'ftablename', width: 120},                 
]
ReactDOM.render(
	React.createElement(JqGrid, {url: "/get/z_entity?_field=fname,ftype,ftablename", domId: "jqGrid", caption: settings.caption, height: settings.height, width: settings.width, pager: settings.pager}),
	document.getElementById('jqGrid')
);