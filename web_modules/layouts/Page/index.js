import React, { Component } from "react"
import { PropTypes } from "react"
import Helmet from "react-helmet"
import invariant from "invariant"
import { BodyContainer } from "phenomic"

import styles from "./index.css"

export default class Page extends Component {

  static propTypes = {
    children: PropTypes.oneOfType([ PropTypes.array, PropTypes.object ]),
    __url: PropTypes.string.isRequired,
    head: PropTypes.object.isRequired,
    body: PropTypes.string.isRequired,
  };

  static contextTypes = {
    metadata: PropTypes.object.isRequired,
  };

  render() {

    const {
      pkg,
    } = this.context.metadata

    const {
      head,
      body,
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
        <BodyContainer>{ body }</BodyContainer>
        { this.props.children }
      </div>
    )
  }
}
