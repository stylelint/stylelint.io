import React, { Component } from "react"
import { PropTypes } from "react"
import Helmet from "react-helmet"
import invariant from "invariant"

import styles from "./index.css"

import DemoLoader from "../../Demo/loader.js"

module.exports = class DemoPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      something: false,
    }
  }

  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
    __url: PropTypes.string.isRequired,
    head: PropTypes.object.isRequired,
  };

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  };

  componentWillMount() {
    // Only load Demo when this layout will be rendered
    DemoLoader().then(({ Demo }) => {
      this.setState({ Demo })
    })
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
        { this.state.Demo ?
          <this.state.Demo.default /> :
          <p className={ styles.loadingMessage }>{ "Loading stylelint..." }</p>
        }
        <link
          rel={ "stylesheet" }
          type={ "text/css" }
          href={ "https://rawgit.com/codemirror/CodeMirror/master/lib/codemirror.css" } // eslint-disable-line max-len
        />
        <link
          rel={ "stylesheet" }
          type={ "text/css" }
          href={ "https://rawgit.com/codemirror/CodeMirror/master/theme/eclipse.css" } // eslint-disable-line max-len
        />
        { this.props.children }
      </div>
    )
  }
}
