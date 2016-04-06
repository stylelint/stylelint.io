import React, { Component } from "react"
import { PropTypes } from "react"
import Helmet from "react-helmet"
import invariant from "invariant"

import Demo from "../../Demo"

import styles from "./index.css"

export default class DemoPage extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
    __url: PropTypes.string.isRequired,
    head: PropTypes.object.isRequired,
  };

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  };

  createMarkup() {
    const src = "https://rawgit.com/m-allanson/stylelint-browser-bundle/7ab3e6f/dist/stylelint-browser-bundle.js" // eslint-disable-line max-len
    return {
      __html: `<script src="${src}"></script>`,
    }
  }

  render() {

    const {
      pkg,
    } = this.context.metadata

    const {
      head,
    } = this.props

    invariant(typeof head.title === "string", "Your page needs a title")

    const title = head.title + " - " + pkg.name
    const meta = []

    return (
      <div className={ styles.root }>
        <Helmet
          title={ title }
          meta={ meta }
        />
        <Demo />
        { this.props.children }
        <div dangerouslySetInnerHTML={ this.createMarkup() } />
      </div>
    )
  }
}
