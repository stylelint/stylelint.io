import React, { Component } from "react"
import LintWarnings from "../LintWarnings/"
import Codemirror from "react-codemirror"
import debounce from "lodash.debounce"
import standardConfig from "stylelint-config-standard"
import stylelintBrowserBundle from "stylelint-browser-bundle"

import "codemirror/mode/css/css"
import "codemirror/mode/javascript/javascript"

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
    this.lint = debounce(this.lint, 250, {
      leading: false,
      trailing: true,
    })

    this.lint = this.lint.bind(this)
    this.parseConfig = this.parseConfig.bind(this)
    this.handleCode = this.handleCode.bind(this)
    this.handleConfig = this.handleConfig.bind(this)
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
    if (this.state.error) return
    const config = this.parseConfig(this.state.config)
    if (!config) return

    const options = {
      ...this.state,
      config: JSON.parse(this.state.config),
    }

    stylelintBrowserBundle(options)
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

  parseConfig(config) {
    try {
      return JSON.parse(config)
    }
    catch (err) {
      this.setState ({
        error: `There was a problem with the config:\n\n ${err}`,
        warnings: [],
      })
      return false
    }
  }

  handleCode(code) {
    this.setState({
      code,
      error: false,
    }, this.lint)
  }

  handleConfig(config) {
    this.setState({
      config,
      error: false,
    }, this.lint)
  }

  render() {
    return (
      <div className={ styles.root }>
        <div className={ styles.input }>
          <Codemirror
            ref={ ref => this.codeMirrorRefs[0] = ref }
            name={ "code" }
            value={ this.state.code }
            onChange={ this.handleCode }
            options={ {
              mode: "css",
              theme: "eclipse",
              lineNumbers: true,
            } }
          />
        </div>
        <div className={ styles.results }>
          <LintWarnings warnings={ this.state.warnings } />
        </div>
        <div className={ styles.console }>{ this.state.error }</div>
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

// import brace from "brace" // eslint-disable-line no-unused-vars
// import AceEditor from "react-ace"
// import AceModeCSS from "brace/mode/css"
// import "brace/theme/github"

/*
<AceEditor
  mode="css"
  theme="github"
  className={ styles.section }
  value={ this.state.code }
  onChange={ this.handleCode }
  showPrintMargin={ false }
  editorProps={ {
    useWorker: false,
    showPrintMargin: false,
  } }
/>
*/
