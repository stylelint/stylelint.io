import React, { Component } from "react"
import Helmet from "react-helmet"
import { browserHistory } from "phenomic/lib/client"

import magnifier from "./magnifier.svg"

import "./index.global.css"
import styles from "./index.css"

export default class DocSearch extends Component {
  componentDidMount() {
    const d = document.createElement("script")
    d.async = true
    d.src = "https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.js"
    d.onload = () => {
      window.docsearch({
        apiKey: '29d680ce97507c5cd2836c6c74783c05',
        indexName: 'stylelint',
        inputSelector: "#algolia-docsearch",
        openOnFocus: true,
        handleSelected:  function(input, event, suggestion) {
          browserHistory.push(
            suggestion.url.replace("https://stylelint.io", "")
          )
        },
        // for styling
        // debug: true,
      })
    }
    document.getElementsByTagName("body")[0].appendChild(d)
  }

  shouldComponentUpdate() {
    return false
  }

  render() {
    return (
      <div className={ styles.docSearch} role="search">
        <Helmet
          link={ [ {
            "rel": "stylesheet",
            "href": "https://cdn.jsdelivr.net/docsearch.js/2/docsearch.min.css",
          } ] }
        />
        <style>{ `
          #algolia-docsearch {
            background:
              url(data:image/svg+xml;utf8,${
                encodeURIComponent(magnifier)
              })
              12px 50% / 14px 14px no-repeat;
            padding-left: 2rem !important;
          }
        `}</style>
        <input
          id="algolia-docsearch"
          placeholder="Search..."
        />
      </div>
    )
  }
}
