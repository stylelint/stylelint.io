const React = require("react");

const FRAME_ORIGIN = "https://stylelint-demo.herokuapp.com";
const inlineScript = `
  var frame = document.getElementById("demo");

  if (frame) {
    window.addEventListener(
      "message",
      function(e) {
        window.location.hash = e.data;
      },
      false
    );
    frame.src = "${FRAME_ORIGIN}" + window.location.hash;
  }
`;

function Demo() {
  return [
    <iframe key="iframe-demo" id="demo" frameBorder="0" />,
    <script
      key="script-demo"
      dangerouslySetInnerHTML={{ __html: inlineScript }}
    />
  ];
}

Demo.title = "Demo";

module.exports = Demo;
