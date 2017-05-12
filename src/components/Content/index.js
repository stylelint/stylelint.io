import React, { PropTypes, Component } from "react"
import { browserHistory } from "phenomic/lib/client"
import getSortedRules from '../../../scripts/ruleNavigation/getSortedRules';
import generateLink from '../../../scripts/ruleNavigation/generateLink';
import styles from "./index.css"

const regex = /\/rules\/.+/;
const sortedRules = getSortedRules();

class Content extends Component {
  constructor(props) {
    super(props);

    this.nextRuleLink = undefined;
    this.prevRuleLink = undefined;
    this.curentUrl = `/${this.props.children.props.routeParams.splat}/`;

    this.navKeyUpHandler = this.navKeyUpHandler.bind(this);
    this.updateRulesLink = this.updateRulesLink.bind(this);

    if (typeof document !== "undefined") {
      document.addEventListener('keyup', this.navKeyUpHandler);
    }
  }

  updateRulesLink() {
    const currentUrl = `/${this.props.children.props.routeParams.splat}/`;

    if (currentUrl.match(regex) !== null) {
     var position = sortedRules.findIndex(item => item.__url === currentUrl);
     this.nextRuleLink = generateLink(sortedRules,position+1, 'Next');
     this.prevRuleLink = generateLink(sortedRules,position-1, 'Prev');
   } else {
     this.nextRuleLink = undefined;
     this.prevRuleLink = undefined;
   }
  }

  componentWillMount() {
    this.updateRulesLink();
  }

  componentDidUpdate() {
    this.updateRulesLink();
  }

  navKeyUpHandler(event) {
    if (window.location.href.match(regex)) {
      if (event.keyCode === 37) {
        if (this.prevRuleLink) {
          browserHistory.push(this.prevRuleLink.props.children.props.to);
        }
      } else if (event.keyCode === 39) {
        if (this.nextRuleLink) {
          browserHistory.push(this.nextRuleLink.props.children.props.to);
        }
      }
    }
  }

  render() {
    this.updateRulesLink();

    if (this.prevRuleLink || this.nextRuleLink) {
      return (
        <div className={ styles.content }>
          <nav className={styles.rulesNavigation}>
            <ol>
              {[this.prevRuleLink, this.nextRuleLink]}
            </ol>
          </nav>
          {this.props.children}
        </div>
      )
    }

    return (
      <div className={ styles.content }>
        {this.props.children}
      </div>
    )
  }
}

Content.propTypes = {
  children: PropTypes.node,
}

export default Content
