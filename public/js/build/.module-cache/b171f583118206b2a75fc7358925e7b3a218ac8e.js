var data={
      url1:"/get/z_entity?_field=fname,ftype,ftablename&ftype=1",
      url1_link_id:"uid",
      url2:"/get/z_entityproperty?_field=fname,ftype,fdbname",
      url2_link_id:"fentityuid",
      table:[
      		
      ]
}

ReactDOM.render(
       React.createElement(LinkedDataTable, {data: data}),
       document.getElementById('entity')
);