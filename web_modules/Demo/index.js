import React, { Component } from "react"
import Codemirror from "react-codemirror"
import LintWarnings from "../LintWarnings/"
import debounce from "lodash.debounce"
import standardConfig from "stylelint-config-standard"
import stylelintBrowserBundle from "stylelint-browser-bundle"

import "codemirror/mode/css/css"
import "codemirror/mode/javascript/javascript"

// leading ! disables existing webpack config. See explanation at:
// https://github.com/webpack/css-loader/issues/80#issuecomment-214222195
import "!style!css!./codemirror.css"
import styles from "./index.css"

export default class Demo extends Component {
  constructor(props) {
    super(props)
    this.codeMirrorRefs = []
    this.state = {
      config: JSON.stringify(standardConfig, null, 2),
      code: "a {color: #FFF; }",
      errors: [],
      warnings: [],
    }
    this.lint = debounce(this.lint, 200)

    this.handleCode = this.handleCode.bind(this)
    this.handleConfig = this.handleConfig.bind(this)
    this.lint = this.lint.bind(this)
    this.parseConfig = this.parseConfig.bind(this)
  }

  componentDidMount() {
    this.lint()

    // When revisiting this page, the codeMirror gutters will be 100% browser
    // width. As a workaround, wait for a tick then tell codeMirror instances
    // to resize themselves
    setTimeout(()=> {
      this.codeMirrorRefs.map(ref => {
        const instance = ref.getCodeMirror()
        instance.refresh()
      })
    }, 16)
  }

  lint() {
    const config = this.parseConfig(this.state.config)
    if (!config) return

    stylelintBrowserBundle({ ...this.state, config })
      .then(output => {
        this.setState({
          warnings: output.results[0].warnings,
          errors: [],
        })
      }).catch(err => {
        this.setState({
          errors: [
            ...this.state.errors,
            `Unable to lint CSS: \n\n ${err}`,
          ],
        })
      })
  }

  parseConfig(config) {
    try {
      const parsed = JSON.parse(config)
      this.setState ({
        errors: [],
      })
      return parsed
    }
    catch (err) {
      this.setState ({
        errors: [
          ...this.state.errors,
          `Unable to parse config:\n\n ${err}`,
        ],
      })
      return false
    }
  }

  handleCode(code) {
    this.setState({
      code,
    }, this.lint)
  }

  handleConfig(config) {
    this.setState({
      config,
    }, this.lint)
  }

  render() {
    const error = (
      <div className={ styles.console }>
        { this.state.errors[this.state.errors.length - 1] }
      </div>
    )

    const warnings = (
      <div className={ styles.results }>
        <LintWarnings warnings={ this.state.warnings } />
      </div>
    )

    return (
      <div className={ styles.root }>
        <Codemirror
          ref={ ref => this.codeMirrorRefs[0] = ref }
          name={ "code" }
          className={ styles.input }
          value={ this.state.code }
          onChange={ this.handleCode }
          options={ {
            mode: "css",
            theme: "eclipse",
            lineNumbers: true,
          } }
        />
        <output className={ styles.output }>
          { this.state.errors.length > 0 ? error : warnings }
        </output>
        <Codemirror
          ref={ ref => this.codeMirrorRefs[1] = ref }
          name={ "config" }
          className={ styles.input }
          value={ this.state.config }
          onChange={ this.handleConfig }
          options={ {
            mode: { name: "javascript", json: true },
            theme: "eclipse",
            lineNumbers: true,
          } }
        />
      </div>
    )
  }
}
