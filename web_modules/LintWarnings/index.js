import React, { Component, PropTypes } from "react"
import cx from "classnames"

import styles from "./index.css"

export default class LintWarnings extends Component {
  static propTypes = {
    warnings: PropTypes.array.isRequired,
  }

  render() {
    return (
      <ul className={ styles.root }> {
        this.props.warnings.map(w => {
          const id = `${w.line}${w.column}${w.text}`
          const location = `${w.line}:${w.column}`
          const severityClassName = cx("", {
            [styles.errorSeverity]: w.severity === "error",
            [styles.warningSeverity]: w.severity === "warning",
          })
          const text = w.text.replace(`(${w.rule})`, "")
          const url = `/user-guide/rules/${w.rule}/`
          return (
            <li className={ styles.result } key={ id }>
              <span className={ styles.location }> { location } </span>
              <span className={ severityClassName }> { w.severity } </span>
              <span className={ styles.message }>
                { text }
                { "(" }
                  <a
                    className={ styles.ruleLink }
                    href={ url }
                  >
                    { w.rule }
                  </a>
                { ")" }
              </span>
            </li>
          )
        })
      } </ul>
    )
  }
}
