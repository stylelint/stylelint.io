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
      .use(removeRuleSmallToc, { heading, layout })
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
            {
              ...tocHeading,
              depth: parent.children[index + 1].depth
            },
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

// Remark plugin for removing TOC for rules if it's to small (one item)
function removeRuleSmallToc(processor, options) {
  return function(tree) {
    if (options.layout !== "RulePage") {
      return;
    }

    visit(tree, "heading", (node, index, parent) => {
      // Look for TOC heading
      if (searchHeading(node, options.heading)) {
        // then check list after this heading
        const list = parent.children[index + 1];

        // Reference structure:
        // {
        //   type: 'list',
        //   children: [
        //     {
        //       type: 'listItem',
        //       children: [
        //         { type: 'paragraph', children: [...] },
        //         {
        //           type: 'list',
        //           children: [{ type: 'listItem', children: [...] }]
        //         }
        //       ]
        //     }
        //   ]
        // }

        // print(list);

        if (list && list.type === "list" && list.children.length === 1) {
          const firstListItemChildren = list.children[0].children;
          let listCount = 0;
          let removeToc = false;

          firstListItemChildren.forEach(list2 => {
            if (list2.type !== "list") {
              return;
            }

            listCount += 1;

            if (listCount > 1) {
              return;
            }

            if (list2.children.length === 1) {
              removeToc = true;
            }
          });

          // if it's has one option, remove it
          if (removeToc) {
            parent.children = [
              ...parent.children.slice(0, index + 1),
              ...parent.children.slice(index + 2)
            ];
          }
        }
      }
    });
  };
}

function searchHeading(node, title) {
  return Boolean(_.find(node.children, { type: "text", value: title }));
}
