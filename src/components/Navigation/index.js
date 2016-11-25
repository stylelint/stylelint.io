import React from "react"
import { Link } from "phenomic"

import styles from "./index.css"

const Navigation = () => (
  <nav className={ styles.navigation } id="navigation" role="navigation">
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
          <li className={ styles.itemSecondary }>
            <Link
              className={ styles.itemInnerSecondary }
              to="/user-guide/processors/"
            >
              { "Processors" }
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
      <li className={ styles.item }>
        <Link
          className={ styles.itemInner }
          to="/demo/"
        >
          { "Demo" }
        </Link>
      </li>
    </ul>
  </nav>
)

export default Navigation
