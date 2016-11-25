import React, { PropTypes } from "react"

import Page from "../Page"

import styles from "./index.css"

const PageError = ({ error, errorText }) => (
  <Page>
    <div className={ styles.container }>
      <div className={ styles.oops }>{ "Error" }</div>
      <div className={ styles.text }>
        <p className={ styles.title }>
          <strong>{ error }</strong>
          { " " }
          { errorText }
        </p>
        {
          error === 404 &&
          <div>
            { "It seems you found a broken link. Please report it. " }
          </div>
        }
      </div>
    </div>
  </Page>
)

PageError.propTypes = {
  error: PropTypes.oneOfType([ PropTypes.number, PropTypes.string ]),
  errorText: PropTypes.string,
}

PageError.defaultProps = {
  error: 404,
  errorText: "Page Not Found",
}

export default PageError
