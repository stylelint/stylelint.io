import React, { PropTypes } from "react"

import Container from "./components/Container"
import Content from "./components/Content"
import DefaultHeadMeta from "./components/DefaultHeadMeta"
import DocSearch from "./components/DocSearch"
import Footer from "./components/Footer"
import GoogleAnalyticsTracker from "./components/GoogleAnalyticsTracker"
import Header from "./components/Header"
import Navigation from "./components/Navigation"

import "./index.global.css"
import "./highlight.global.css"

const AppContainer = (props) => (
  <GoogleAnalyticsTracker params={ props.params }>
    <Container>
      <DefaultHeadMeta />
      <Header />
      <Content>
        { props.children }
      </Content>
      <Navigation />
      <DocSearch />
      <Footer />
    </Container>
  </GoogleAnalyticsTracker>
)

AppContainer.propTypes = {
  children: PropTypes.node,
  params: PropTypes.object,
}

export default AppContainer
