import React, { Component } from "react"
import standardConfig from "stylelint-config-standard"
import stylelintBrowserBundle from "stylelint-browser-bundle"

import styles from "./index.css"

export default class Demo extends Component {
  constructor(props) {
    super(props)
    this.state = {
      config: standardConfig,
      code: "a {} b {color: #FFF; }",
      errors: [],
      warnings: [],
    }
    this.lint = this.lint.bind(this)
    this.updateCode = this.updateCode.bind(this)
    this.updateConfig = this.updateConfig.bind(this)
  }

  componentDidMount() {
    this.lint()
  }

  lint() {
    if (this.state.error) return

    stylelintBrowserBundle(this.state)
      .then(output => {
        this.setState({
          warnings: output.results[0].warnings,
          error: false,
        })
      }).catch(err => {
        this.setState({
          error: `Failed to lint CSS! \n\n ${err}`,
          warnings: [],
        })
      })
  }

  updateCode(event) {
    this.setState({
      code: event.target.value,
      error: false,
    }, this.lint)
  }

  updateConfig(event) {
    let nextState

    try {
      nextState = {
        config: JSON.parse(event.target.value),
        error: false,
      }
    }
    catch (err) {
      nextState = {
        error: `There was a problem with the config:\n\n ${err}`,
        warnings: [],
      }
    }

    this.setState(nextState, this.lint)
  }

  render() {
    return (
      <div className={ styles.root }>
        <div className={ styles.section }>
          <textarea
            className={ styles.code }
            spellCheck="false"
            defaultValue={ this.state.code }
            onChange={ this.updateCode }
          ></textarea>
        </div>
        <div className={ styles.section }>
          <pre className={ styles.results }>
            {
              this.state.warnings.map(w =>
                `Line ${w.line}, Col ${w.column}: ${w.text}\n`
              )
            }
          </pre>
          <div className={ styles.console }>{ this.state.error }</div>
        </div>
        <div className={ styles.section }>
          <textarea
            className={ styles.config }
            spellCheck="false"
            defaultValue={ JSON.stringify(this.state.config, null, 2) }
            onChange={ this.updateConfig }
          ></textarea>
        </div>
      </div>
    )
  }
}
