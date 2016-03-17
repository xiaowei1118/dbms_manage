var data={
      url1:"/z_entity?_field=fname,ftype,ftablename&ftype=1",
      url1_link_id:"uid",
      url2:"/z_entityproperty?_field=fname,ftype,fdbname",
      url2_link_id:"fentityuid"
   }
   ReactDOM.render(
       <LinkedDataTable data={data}/>,
       document.getElementById('entity')
);