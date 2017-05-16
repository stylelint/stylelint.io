import React, { PropTypes } from "react"
import Helmet from "react-helmet"
import warning from "warning"
import { BodyContainer, joinUri } from "phenomic"
import { Link } from "phenomic"

import Loading from "../../components/Loading"

import styles from "./index.css"

const RulePage = (
  {
    isLoading,
    __filename,
    __url,
    head,
    body,
    header,
    footer,
    children,
  },
  {
    metadata: { pkg },
  }
) => {
  warning(
    typeof head.title === "string",
    `Your RulePage '${ __filename }' needs a title`
  )

  const metaTitle = head.metaTitle ? head.metaTitle : head.title

  const meta = [
    { property: "og:type", content: "article" },
    { property: "og:title", content: metaTitle },
    {
      property: "og:url",
      content: joinUri(process.env.PHENOMIC_USER_URL, __url),
    },
    { property: "og:description", content: head.description },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:title", content: metaTitle },
    { name: "twitter:creator", content: `@${ pkg.twitter }` },
    { name: "twitter:description", content: head.description },
    { name: "description", content: head.description },
  ]

  let nextRuleLink;
  let prevRuleLink;

  if (head.next !== null) {
    nextRuleLink = <li className={ styles.ruleLinkItem }>
      <Link className={styles.ruleLink} to={head.next}>{'Next'}</Link>
    </li>;
  }

  if (head.prev !== null) {
    prevRuleLink = <li className={ styles.ruleLinkItem }>
      <Link className={styles.ruleLink} to={head.prev}>{'Prev'}</Link>
    </li>;
  }

  return (
    <div className={ styles.RulePage }>
      <Helmet
        title={ metaTitle }
        meta={ meta }
      />
      { header }
      <nav className={styles.rulesNavigation}>
        <ol>
          {[prevRuleLink, nextRuleLink]}
        </ol>
      </nav>
      <div className={ styles.body }>
        {
          isLoading
          ? <Loading />
        : <BodyContainer>{ body }</BodyContainer>
        }
      </div>
      { children }
      { footer }
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
