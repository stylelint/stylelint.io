import PropTypes from "prop-types";
import React from "react";

import isChrome from "./utils/isChrome";
import isSafari from "./utils/isSafari";

import Container from "./components/Container";
import Content from "./components/Content";
import DefaultHeadMeta from "./components/DefaultHeadMeta";
import DocSearch from "./components/DocSearch";
import Footer from "./components/Footer";
import GoogleAnalyticsTracker from "./components/GoogleAnalyticsTracker";
import Header from "./components/Header";
import Navigation from "./components/Navigation";

import "./index.global.css";
import "./highlight.global.css";

class AppContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Fix scroll to element from url fragment on initial load in Chrome and Safari
    // https://bugs.chromium.org/p/chromium/issues/detail?id=718468
    if ((isChrome() || isSafari()) && window.location.hash) {
      setTimeout(function() {
        const elementId = window.location.hash.replace("#", "");
        const scrollToElement = document.getElementById(elementId);

        if (scrollToElement) {
          scrollToElement.scrollIntoView();
        }
      });
    }
  }

  render() {
    return (
      <GoogleAnalyticsTracker params={this.props.params}>
        <Container>
          <DefaultHeadMeta />
          <Header />
          <Content>{this.props.children}</Content>
          <Navigation />
          <DocSearch />
          <Footer />
        </Container>
      </GoogleAnalyticsTracker>
    );
  }
}

AppContainer.propTypes = {
  children: PropTypes.node,
  params: PropTypes.object
};

AppContainer.propTypes = {
  children: PropTypes.node,
  params: PropTypes.object
};

export default AppContainer;
