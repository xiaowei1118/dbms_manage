var fakeData =  [
  {
    "columnName": "name",
    "order": 9,
    "locked": false,
    "visible": true,
    "displayName": "Employee Name"
  },
  {
    "columnName": "city",
    "order": 8,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "state",
    "order": 7,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "country",
    "order": 6,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "company",
    "order": 5,
    "locked": false,
    "visible": true
  },
  {
    "columnName": "favoriteNumber",
    "order":  4,
    "locked": false,
    "visible": true,
    "displayName": "Favorite Number"
 }
]
ReactDOM.render(
   React.createElement(Griddle, {results: fakeData, tableClassName: "table", showFilter: true, showSettings: true, columns: ["name", "city", "state", "country"]}),
   document.getElementById('content')
);