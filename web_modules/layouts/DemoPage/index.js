import React, { Component, PropTypes } from "react"
import Helmet from "react-helmet"
import invariant from "invariant"

import styles from "./index.css"

import Demo from "../../Demo/index.js"

export default class DemoPage extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
    __url: PropTypes.string.isRequired,
    head: PropTypes.object.isRequired,
  }

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
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
      </div>
    )
  }
}
