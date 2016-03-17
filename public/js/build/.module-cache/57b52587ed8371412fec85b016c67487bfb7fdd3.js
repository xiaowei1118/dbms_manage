var LeftTree = React.createClass({displayName: "LeftTree",
  getInitialState: function() {
      return {
          readOnly: false,
          selectAble: false,
          greedy:false,
      };
  },
  render: function() {
    return (
      React.createElement("div", {className: "LeftTree"}, 
          React.createElement(Tree, {ref: "tree", data: dataSource("data/left_tree.json"), 
          readOnly: this.state.readOnly, 
          selectAble: this.state.selectAble, 
          greedy: this.state.greedy, 
          onChange: this.handleChange.bind(this), 
          onClick: item => this.refs.textClick.getDOMNode().innerText = 'clicked ' + item.text, 
          textTpl: "{text}({id})", 
          valueTpl: "{id}", 
          value: this.state.value, 
          open: true, 
          sep: this.state.sep}
          )
      )
    );
  }
});
ReactDOM.render(
  React.createElement(Tree, {
  className: "left_tree", // class
  selectAble: false, // 是否可编辑，默认为 false
  data: dataSource("data/left_tree.json"), // 数据，array 或者 dataSource
  // 返回值分隔字符，默认值为 ","。为 "" 或 null 时，返回值类型为 array
  greedy: false, // 为true时，getValue返回的值包含半选中项
 
  readOnly: false, // 为 true 时，只读。默认为 false
  textTpl: "{text}", // 显示文字模板，默认为 "{text}"
  valueTpl: "{id}"}// 返回数据模板，默认为 "{id}"
),
  document.getElementById("left_tree")
);
