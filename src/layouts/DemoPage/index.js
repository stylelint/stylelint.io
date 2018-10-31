import PropTypes from "prop-types";
import React from "react";
import Helmet from "react-helmet";

import Demo from "../../components/Demo";

import styles from "./index.css";

const meta = head => [{ name: "description", content: head.description }];

const DemoPage = ({ head }) => (
  <div className={styles.demoPage}>
    <Helmet title={head.title} meta={meta(head)} />
    <Demo />
  </div>
);

DemoPage.propTypes = {
  head: PropTypes.object.isRequired
};

export default DemoPage;
