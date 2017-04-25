/**
 * Remark plugin to add classes to valid and invalid code patterns
 */

import visit from "unist-util-visit"
import toString from "mdast-util-to-string"

const validTriggers = [
  "The following patterns are not considered violations:",
  "The following pattern is not considered a violation:",
]
const invalidTriggers = [
  "The following patterns are considered violations:",
  "The following pattern is considered a violation:",
]
const resetTrigger = "Given:"

const validClass = "valid-pattern"
const invalidClass = "invalid-pattern"

export default function attacher () {

  let invalidPatternFlag = false
  let validPatternFlag = false

  function visitor (node) {
    // Paragraphs with certain content act as triggers
    if (node.type === "paragraph") {
      const nodeAsString = toString(node)
      if (validTriggers.includes(nodeAsString)) {
        invalidPatternFlag = false
        validPatternFlag = true
      } else if (invalidTriggers.includes(nodeAsString)) {
        invalidPatternFlag = true
        validPatternFlag = false
      } else if (resetTrigger === nodeAsString) {
        invalidPatternFlag = false
        validPatternFlag = false
      }
    }

    // All headings trigger a reset
    if (node.type === "heading") {
      invalidPatternFlag = false
      validPatternFlag = false
    }

    // Add classes to code nodes depending on flags
    if (node.type === "code") {
      // Return early if not css-like code fence
      if (!node.lang.includes("css", "scss", "less")) {
        return
      }

      // Prepare node data
      let {data} = node;
      if (!data) {
        node.data = data = {};
      }

      // Add classes
      data.hProperties = data.hProperties || {};
      data.hProperties.className = [
        ...data.hProperties.className || [],
        validPatternFlag ? validClass : "",
        invalidPatternFlag ? invalidClass : "",
      ];
    }
  }

  return ast => visit(ast, visitor);
}
