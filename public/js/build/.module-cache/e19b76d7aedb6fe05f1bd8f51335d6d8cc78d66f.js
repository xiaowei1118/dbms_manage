var fakeData =  [
  {
    "id": 0,
    "name": "Mayer Leonard",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 1,
    "name": "Mayer Leonard",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 2,
    "name": "Mayer Leonard",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
  {
    "id": 3,
    "name": "Mayer Leonard",
    "city": "Kapowsin",
    "state": "Hawaii",
    "country": "United Kingdom",
    "company": "Ovolo",
    "favoriteNumber": 7
  },
];
var columnSettings=[
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
    "displayName": "number"
  }
]
ReactDOM.render(
   React.createElement(Griddle, {results: fakeData, tableClassName: "table", columnMetadata: columnSettings, showFilter: true, showSettings: true, columns: ["name", "city", "state", "country"]}),
   document.getElementById('content')
);