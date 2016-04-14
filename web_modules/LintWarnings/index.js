import React, { Component, PropTypes } from "react"

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
          const location = `Line ${w.line} Col ${w.column}`
          return (
            <li className={ styles.result } key={ id } >
              <p className={ styles.location }> { location } </p>
              <p className={ styles.message }>{ w.text }</p>
            </li>
          )
        })
      } </ul>
    )
  }
}
