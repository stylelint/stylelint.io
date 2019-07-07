/* eslint-disable react/prop-types */
const React = require("react");

function Footer({ config }) {
  return (
    <footer className="nav-footer" id="footer">
      <section className="copyright">{config.copyright}</section>
    </footer>
  );
}

module.exports = Footer;
