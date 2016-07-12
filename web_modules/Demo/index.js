import React, { Component } from "react"

import styles from "./index.css"

export default class Demo extends Component {
  render() {
    return (
      <iframe
        className={ styles.root }
        src="http://stylelint-demo.herokuapp.com"
        frameBorder="0"
      ></iframe>
    )
  }
}
