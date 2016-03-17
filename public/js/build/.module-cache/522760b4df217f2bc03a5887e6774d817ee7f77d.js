var settings = {
	width: "500px",
	height: "600px",
	pager: "#jqGridPager",
	caption: "实体表"
};
var colModel = [{ label: 'ID', name: 'uid', width: 100 }, { label: '实体名称', name: 'fname', width: 100 }, { label: '实体类型', name: 'ftype', width: 100 }, { label: '表名称', name: 'ftablename', width: 120 }];
ReactDOM.render(React.createElement(JqGrid, { url: "/get/z_entity?_field=fname,ftype,ftablename", domId: "jqGrid", caption: settings.caption, height: settings.height, width: settings.width, pager: settings.pager, colModel: colModel }), document.getElementById('jqGrid'));