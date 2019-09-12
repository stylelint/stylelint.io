const React = require("react");

function Demo() {
  return [
    <iframe
      id="demo"
      src="https://stylelint-demo.herokuapp.com"
      frameBorder="0"
    />,
    <script src="/js/watchIFrame.js" />
  ];
}

Demo.title = "Demo";

module.exports = Demo;
