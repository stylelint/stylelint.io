import React, { PropTypes } from "react"
import { Link } from "phenomic"
import Svg from "react-svg-inline"

import burger from './burger.svg'
import logo from './logo.svg'

import styles from "./index.css"

const Header = () => (
  <header
    className={ styles.header }
    role="banner"
  >
    <p className={ styles.inner }>
      <Link
        className={ styles.logo }
        to="/"
      >
        <Svg
          className={ styles.logoSvg }
          svg={ logo }
        />
      </Link>
      <a
        className={ styles.burger }
        href="#navigation"
      >
        <Svg
          className={ styles.burgerSvg }
          svg={ burger }
        />
      </a>
    </p>
  </header>
)

Header.contextTypes = {
  metadata: PropTypes.object.isRequired,
}

export default Header
