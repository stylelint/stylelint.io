import React, { Component } from "react"
import { PropTypes } from "react"
import Helmet from "react-helmet"

import Header from "../Header"
import Navigation from "../Navigation"
import Social from "../Social"
import Footer from "../Footer"
import GoogleAnalyticsTracker from "../GoogleAnalyticsTracker"

import styles from "./index.css"

import ogImage from "./opengraph.png"
import favicon from "./favicon.ico"
import favicon192x192 from "./favicon-192x192.png"

export default class LayoutContainer extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
    params: PropTypes.object,
  };

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  };

  render() {
    const {
      pkg,
    } = this.context.metadata

    /* eslint-disable max-len */
    return (
      <GoogleAnalyticsTracker params={ this.props.params }>
        <div className={ styles.root }>
          <Helmet
            meta={ [
              { name: "description", content: `${ pkg.description }` },
              { name: "twitter:card", content: "summary" },
              { name: "twitter:creator", content: `@${ pkg.twitter }` },
              { name: "twitter:site", content: `@${ pkg.twitter }` },
              { property: "og:description", content: pkg.description },
              { property: "og:image", content: ogImage },
              { property: "og:site_name", content: pkg.name },
              { property: "og:type", content: "article" },
              { property: "og:url", content: pkg.homepage },
            ] }
            link={ [
              { "rel": "stylesheet",
                "href":
                "https://fonts.googleapis.com/css?family=Alegreya+Sans:400,700,700italic,400italic|Oxygen+Mono|Work+Sans:300,400&subset=latin",
              },
              { "rel": "stylesheet",
                "href":
                "https://fonts.googleapis.com/css?family=Niconne&text=stylelint",
              },
              { "rel": "stylesheet",
                "href":
                "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.1.0/styles/github-gist.min.css",
              },
              {
                "rel": "shortcut icon",
                "type": "image/png",
                "href": favicon,
              },
              {
                "rel": "icon",
                "type": "image/png",
                "href": favicon192x192,
                "sizes": "192x192",
              },
            ] }
            script={ [
              { "src": "https://cdn.polyfill.io/v2/polyfill.min.js" },
            ] }
          />
          <div className={ styles.header }>
            <Header />
          </div>
          <div className={ styles.main }>
            { this.props.children }
          </div>
          <div className={ styles.navigation }>
            <Navigation />
          </div>
          <div className={ styles.social }>
            <Social />
          </div>
          <div className={ styles.footer }>
            <Footer />
          </div>
        </div>
       </GoogleAnalyticsTracker>
    )
  }
}
