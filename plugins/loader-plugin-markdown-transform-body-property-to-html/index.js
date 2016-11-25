/**
 * Adaption of phenomic's default markdown plugin.
 *
 * Calls two custom remark plugins
 */

import remark from "remark"
import slug from "remark-slug"
import autoLinkHeadings from "remark-autolink-headings"
import highlight from "remark-highlight.js"
import html from "remark-html"
import stylelintPatternValidity from "../remark-stylelint-pattern-validity"
import stylelintUrl from "../remark-stylelint-url"

function mdify(text) {
  return remark()
    // Two custom stylelint remark plugins
    .use(stylelintUrl)
    .use(stylelintPatternValidity)

    // https://github.com/wooorm/remark-slug
    .use(slug)

    // https://github.com/ben-eb/remark-autolink-headings
    .use(autoLinkHeadings, {
      content: {
        type: "text",
        value: "#",
      },
      linkProperties: {
        className: "phenomic-HeadingAnchor",
      },
    })

    // https://github.com/wooorm/remark-html
    .use(html, { entities: "escape" })

    // https://github.com/ben-eb/remark-highlight.js
    .use(highlight)

    // render
    .process(text, {
      commonmark: true,
    })
    .toString()
}

export default ({result}) => {
  return {
    ...result,
    body: mdify(result.body),
  }
}
