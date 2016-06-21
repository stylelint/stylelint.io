import React, { Component } from "react"
import { PropTypes } from "react"
import Helmet from "react-helmet"
import invariant from "invariant"
import { BodyContainer } from "phenomic"

import styles from "./index.css"

const triggers = {
  validPattern: "The following patterns are not considered warnings:",
  invalidPattern: "The following patterns are considered warnings:",
}

function applyTransformsToContent(bodyContent) {
  let invalidPatternFlag = false
  let validPatternFlag = false

  bodyContent.childNodes.forEach((node) => {
    if (!node.classList) {
      return
    }

    if (nodeIsPatternTrigger(node, triggers.validPattern)) {
      invalidPatternFlag = false
      validPatternFlag = true
      node.classList.add("valid-pattern")
    }

    if (nodeIsPatternTrigger(node, triggers.invalidPattern)) {
      invalidPatternFlag = true
      validPatternFlag = false
      node.classList.add("invalid-pattern")
    }

    if (nodeIsTriggerReset(node)) {
      invalidPatternFlag = false
      validPatternFlag = false
    }

    appendFlagsToPre(node, validPatternFlag, invalidPatternFlag)
  })
}

function nodeIsPatternTrigger(node, triggerText) {
  return node.tagName === "P" && node.innerText === triggerText
}

function nodeIsTriggerReset(node) {
  const resetTriggers = [ "H1", "H2", "H3", "H4", "H5", "H6" ]

  if (resetTriggers.indexOf(node.tagName) !== -1) {
    return true
  }
}

function appendFlagsToPre(node, validFlag, invalidFlag) {
  if (node.tagName === "PRE") {
    validFlag && node.classList.add("valid-pattern")
    invalidFlag && node.classList.add("invalid-pattern")
  }
}

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

  componentDidMount() {
    applyTransformsToContent(this._bodyContent)
  }

  componentDidUpdate() {
    applyTransformsToContent(this._bodyContent)
  }

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

    /* eslint-disable react/jsx-no-bind, brace-style */
    return (
      <div className={ styles.root }>
        <Helmet
          title={ title }
          meta={ meta }
        />
        <BodyContainer>{
          <div
            ref={ (c) => { this._bodyContent = c } }
            dangerouslySetInnerHTML={ { __html: body } }
          />
        }</BodyContainer>
        { this.props.children }
      </div>
    )
    /* eslint-enable react/jsx-no-bind, brace-style */
  }
}
