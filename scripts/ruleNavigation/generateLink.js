import React from "react"
import { Link } from "phenomic"
import styles from "../../src/components/Content/index.css";

const generateLink = (rules, position, content) => {
  const rule = rules[position];

  if (rule !== undefined) {
    return (<li className={ styles.ruleLinkItem }>
      <Link className={ styles.ruleLink } to={rule.__url}>{content}</Link>
    </li>);
  }

  return undefined;
}

export default generateLink;
