var data={
      url1:"/get/z_entity?_field=fname,ftype,ftablename&ftype=1",
      url1_link_id:"uid",
      url2:"/get/z_entityproperty?_field=fname,ftype,fdbname",
      url2_link_id:"fentityuid",
}

var columnMetas1=[
	{

	},
]

var columnMetas2=[
   {
    "columnName": "fname",
    "order": 2,
    "locked": false,
    "visible": true,
    "displayName": "名称"
   },
   {
    "columnName": "uid",
    "order": 1,
    "locked": false,
    "visible": true,
    "displayName": "ID"
   },
   {
    "columnName": "ftype",
    "order": 3,
    "locked": false,
    "visible": true,
    "displayName": "类别"
   },
   {
    "columnName": "ftable",
    "order": 1,
    "locked": false,
    "visible": true,
    "displayName": "表名称"
   },
]
ReactDOM.render(
       React.createElement(LinkedDataTable, {data: data, table1columns: columnMetas1, table2columns: columnMetas2}),
       document.getElementById('entity')
);