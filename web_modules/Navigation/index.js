import React, { Component } from "react"
import { Link } from "react-router"

import styles from "./index.css"

export default class Navigation extends Component {

  render() {
    return (
      <nav className={ styles.root } id="navigation" role="navigation">
        <ul className={ styles.items }>
          <li className={ styles.item }>
            <Link
              className={ styles.itemInner }
              to="/user-guide/"
            >
              { "User guide" }
            </Link>
            <ul className={ styles.secondaryItems }>
              <li className={ styles.itemSecondary }>
                <Link
                  className={ styles.itemInnerSecondary }
                  to="/user-guide/rules/"
                >
                  { "Rules" }
                </Link>
              </li>
              <li className={ styles.itemSecondary }>
                <Link
                  className={ styles.itemInnerSecondary }
                  to="/user-guide/plugins/"
                >
                  { "Plugins" }
                </Link>
              </li>
            </ul>
          </li>
          <li className={ styles.item }>
            <Link
              className={ styles.itemInner }
              to="/developer-guide/"
            >
              { "Developer guide" }
            </Link>
          </li>
        </ul>
      </nav>
    )
  }
}
