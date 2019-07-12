/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const glob = require("glob");
const remark = require("remark");
const inlineLinks = require("remark-inline-links");
const visit = require("unist-util-visit");

// NOTE: Since Node 10.12.0, `fs.mkdirSync(dir, { recursive: true })` has been supported.
//
// If using the version or newer, this utility function can be replaced.
// See https://github.com/nodejs/node/blob/v10.12.0/doc/changelogs/CHANGELOG_V10.md
function mkdir_p(dir) {
  dir.split(path.sep).reduce((parentDir, currentDir) => {
    const newDir = path.join(parentDir, currentDir);
    if (!fs.existsSync(newDir)) {
      fs.mkdirSync(newDir);
    }
    return newDir;
  }, "");
}

function processMarkdown(file, { rewriter }) {
  function rewriteLink({ rewriter }) {
    function visitor(node) {
      node.url = rewriter(node.url);
    }
    function transform(tree) {
      visit(tree, ["link"], visitor);
    }
    return transform;
  }

  const content = remark()
    .use(rewriteLink, { rewriter })
    .use(inlineLinks)
    .processSync(fs.readFileSync(file, "utf8"))
    .toString();

  // Add Docusaurus-specific fields. See https://docusaurus.io/docs/en/doc-markdown
  const title = content.match(/\n?# ([^\n]+)\n/)[1];
  const titleToSidebarLabel = {
    stylelint: "Home"
  };
  const sidebarLabel = titleToSidebarLabel[title] || title;
  return `---
title: ${title}
sidebar_label: ${sidebarLabel}
hide_title: true
---

${content}`;
}

// For Docusaurus. See https://docusaurus.io/docs/en/navigation
function generateSidebarsJson(outputDir, rulesDir) {
  const json = JSON.parse(
    fs.readFileSync(path.join(__dirname, "sidebars-template.json"), "utf8")
  );
  json.docs.Rules = fs
    .readdirSync(path.join(outputDir, rulesDir))
    .map(filename => `${rulesDir}/${path.basename(filename, ".md")}`)
    .sort();

  const outputFile = path.join("website", "sidebars.json");
  fs.writeFileSync(outputFile, JSON.stringify(json, null, 2), "utf8");

  return outputFile;
}

function main(outputDir) {
  fs.mkdirSync(outputDir);

  glob.sync("node_modules/stylelint/*.md").forEach(async file => {
    const output = processMarkdown(file, {
      rewriter: url =>
        url.replace(/^\/?docs\//, "").replace("README.md", "index.md")
    });
    const outputFile = path.join(
      outputDir,
      file
        .replace("node_modules/stylelint", "")
        .replace("README.md", "index.md")
    );
    mkdir_p(path.dirname(outputFile));
    fs.writeFileSync(outputFile, output, "utf8");
    console.log(outputFile);
  });

  glob.sync("node_modules/stylelint/docs/**/*.md").forEach(file => {
    const output = processMarkdown(file, {
      rewriter: url =>
        url
          .replace(
            "../../lib/rules/index.js",
            "https://github.com/stylelint/stylelint/blob/master/lib/rules/index.js"
          )
          .replace("../../VISION.md", "../VISION.md")
          .replace("../../lib/rules/", "rules/")
          .replace("/README.md", ".md")
    });
    const outputFile = path.join(
      outputDir,
      file.replace("node_modules/stylelint/docs", "")
    );
    mkdir_p(path.dirname(outputFile));
    fs.writeFileSync(outputFile, output, "utf8");
    console.log(outputFile);
  });

  glob.sync("node_modules/stylelint/lib/rules/**/*.md").forEach(file => {
    const output = processMarkdown(file, {
      rewriter: url =>
        url
          .replace(/\.\.\/([a-z-]+)\/README.md/, "$1.md")
          .replace(
            /\.\.\/\.\.\/\.\.\/docs\/user-guide\/([a-z-]+)\.md/,
            "../$1.md"
          )
    });
    const outputFile = path.join(
      outputDir,
      file
        .replace("node_modules/stylelint/lib/rules", "user-guide/rules")
        .replace("/README.md", ".md")
    );
    mkdir_p(path.dirname(outputFile));
    fs.writeFileSync(outputFile, output, "utf8");
    console.log(outputFile);
  });

  const sidebarsJson = generateSidebarsJson(outputDir, "user-guide/rules");
  console.log(`Generated: ${sidebarsJson}`);
}

main(process.argv[2]);
