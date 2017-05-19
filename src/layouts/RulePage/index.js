import React, { PropTypes } from "react"
import { Link } from "phenomic"

import Page from "../Page"
import styles from "./index.css"

const RulePage = (props) => {
  const {
    head: {
      next,
      prev
    }
  } = props
  return (
    <div>
      <Page { ...props } />
      <nav className={styles.navigation}>
        { prev &&
          <Link
            className={styles.link}
            to={prev}>{'← Prev'}
          </Link>
        }
        { next &&
          <Link
            className={styles.link}
            to={next}>{'Next →'}
          </Link>
        }
      </nav>
    </div>
  )
}

RulePage.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  __filename: PropTypes.string,
  __url: PropTypes.string,
  head: PropTypes.shape({
    prev: PropTypes.string,
    next: PropTypes.string
  }).isRequired,
  body: PropTypes.string,
  header: PropTypes.element,
  footer: PropTypes.element,
}

RulePage.contextTypes = {
  metadata: PropTypes.object.isRequired,
}

export default RulePage
