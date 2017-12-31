import _ from "lodash";
import tocPlugin from "remark-toc";
import visit from "unist-util-visit";

export default function stylelintToc(processor, { layout }) {
  return function transformer() {
    const heading = "Table of Contents";

    // Using sequence of plugins, because otherwise their run order is random
    processor
      .use(addTocHeading, { heading, layout })
      .use(tocPlugin, { heading })
      .use(removeTocHeading, { heading });
  };
}

// Remark plugin for adding TOC heading
function addTocHeading(processor, options) {
  return function(tree) {
    const tocComment = "<!-- TOC -->";
    const tocHeading = {
      type: "heading",
      depth: 2,
      children: [
        {
          type: "text",
          value: options.heading
        }
      ]
    };
    let tocComments = 0;

    // Search for TOC comment
    visit(tree, "html", node => {
      if (node.value === tocComment) {
        tocComments += 1;
      }
    });

    // Don't do anything if there more than one comment
    if (tocComments > 1) {
      return;
    }

    // Replace TOC comment with TOC heading
    if (tocComments === 1) {
      visit(tree, "html", (node, index, parent) => {
        if (node.value === tocComment) {
          parent.children = [
            ...parent.children.slice(0, index),
            tocHeading,
            ...parent.children.slice(index + 1)
          ];
        }
      });
    }

    // Create TOC heading on a rule page before Options heading
    if (tocComments === 0 && options.layout === "RulePage") {
      visit(tree, "heading", (node, index, parent) => {
        if (searchHeading(node, "Options", tree)) {
          parent.children = [
            ...parent.children.slice(0, index),
            tocHeading,
            ...parent.children.slice(index)
          ];
        }
      });
    }
  };
}

// Remark plugin for removing TOC heading
function removeTocHeading(processor, options) {
  return function(tree) {
    visit(tree, "heading", (node, index, parent) => {
      if (searchHeading(node, options.heading)) {
        parent.children = [
          ...parent.children.slice(0, index),
          ...parent.children.slice(index + 1)
        ];
      }
    });
  };
}

function searchHeading(node, title) {
  return Boolean(_.find(node.children, { type: "text", value: title }));
}
