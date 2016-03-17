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
  React.createElement(Tree, null),
  document.getElementById("left_tree")
);
