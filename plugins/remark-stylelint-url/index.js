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
    if (!node.url.startsWith("http")) {
      node.url = node.url
        .replace("../../src/rules/", "/user-guide/rules/") // rule README paths
        .replace("/README", "") // rule README filename
        .replace("docs/", "") // other docs' paths
        .replace(".md", "/") // all .md extensions
    }
  }

  return ast => visit(ast, 'link', visitor);
}
