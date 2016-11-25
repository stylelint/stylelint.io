import React from "react"
import Svg from "react-svg-inline"

import github from './github.svg'
import twitter from './twitter.svg'

import styles from "./index.css"

const Footer = () => (
  <footer className={ styles.footer } role="contentinfo">
    <ul className={ styles.items }>
      <li className={ styles.item }>
        <a
          className={ styles.itemInner }
          href="https://github.com/stylelint/stylelint"
        >
          <Svg
            className={ styles.svg }
            svg={ github }
          />
        </a>
      </li>
      <li className={ styles.item }>
        <a
          className={ styles.itemInner }
          href="https://twitter.com/stylelint"
        >
          <Svg
            className={ styles.svg }
            svg={ twitter}
          />
        </a>
      </li>
    </ul>
  </footer>
)

export default Footer
