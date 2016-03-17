setData=function(data){
   this.data=data;
}

ReactDOM.render(
   React.createElement(Griddle, {results: this.data, tableClassName: "table", showFilter: true, showSettings: true, columns: ["name", "city", "state", "country"]}),
   document.getElementById('content')
);