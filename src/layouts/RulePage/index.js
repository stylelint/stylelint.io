import React, { PropTypes } from "react"
import { Link } from "phenomic"

import Page from "../Page"
import styles from "./index.css"

const RulePage = (props) => {
  let nextRuleLink;
  let prevRuleLink;

  if (props.head.next !== null) {
    nextRuleLink = <li className={ styles.ruleLinkItem }>
      <Link className={styles.ruleLink} to={props.head.next}>{'Next'}</Link>
    </li>;
  }

  if (props.head.prev !== null) {
    prevRuleLink = <li className={ styles.ruleLinkItem }>
      <Link className={styles.ruleLink} to={props.head.prev}>{'Prev'}</Link>
    </li>;
  }

  return (
    <div>
      <nav className={styles.rulesNavigation}>
        <ol>
          {[prevRuleLink, nextRuleLink]}
        </ol>
      </nav>
      <Page { ...props } />
    </div>
  )
}

RulePage.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  __filename: PropTypes.string,
  __url: PropTypes.string,
  head: PropTypes.object.isRequired,
  body: PropTypes.string,
  header: PropTypes.element,
  footer: PropTypes.element,
}

RulePage.contextTypes = {
  metadata: PropTypes.object.isRequired,
}

export default RulePage
