import React, { Component, PropTypes } from "react"
import styles from "./index.css"

export default class PageError extends Component {

  static propTypes = {
    error: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
    errorText: PropTypes.string,
  };

  static defaultProps = {
    error: 404,
    errorText: "Page Not Found",
  };

  render() {
    const {
      error,
      errorText,
    } = this.props

    return (
      <div className={ styles.base }>
        <h1 className={ styles.title }>
          <strong>{ error }</strong>
          { " " }
          { errorText }
        </h1>
        {
          error === 404 &&
          <p className={ styles.text }>
            { "Please report this error" }
          </p>
        }
      </div>
    )
  }
}
