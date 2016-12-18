/**
 * Remark plugin to process urls.
 *
 * Some links within the documentation need to be rewritten as the
 * directory structure is different between the github repo and the website
 */

import visit from "unist-util-visit";

export default function attacher () {

  function visitor (node) {
    // Only change relative or absolute urls
    if (!node.url.startsWith("http") && !node.url.startsWith("#")) {

      // If the URL isn't an inter-rule one
      if (!node.url.endsWith("/README.md")) {
        // Add an addition "up-one-level" as each markdown file is converted
        // to an index.html _within its own directory_.
        node.url = `../${node.url}`
      }

      // Common URL replacements
      node.url = node.url
        // rule README paths as moved from src folder to within user-guide folder
        .replace("../../lib/rules/", "")
        // rule README filename as now index.html
        .replace("/README", "")
        // Urls from within root markdown files (e.g. changelog and README) can
        // include path to "docs" directory, which is removed for the website
        .replace("docs/", "")
        // all .md extensions as now index.html files
        .replace(".md", "/")
    }
  }

  return ast => visit(ast, 'link', visitor);
}
