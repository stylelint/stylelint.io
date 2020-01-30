const fs = require("fs");
const path = require("path");
const glob = require("glob");
const remark = require("remark");
const visit = require("unist-util-visit");
const siteConfig = require("../website/siteConfig");

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
    .processSync(fs.readFileSync(file, "utf8"))
    .toString();

  // Add Docusaurus-specific fields. See https://docusaurus.io/docs/en/doc-markdown
  let title = content.match(/\n?# ([^\n]+)\n/)[1];

  const titleToSidebarLabel = {
    stylelint: "Home"
  };

  const sidebarLabel = titleToSidebarLabel[title] || title;

  if (title === "stylelint") {
    // Check for homepage
    title = siteConfig.tagline;
  }

  const editPath = file
    .replace(path.join("node_modules", "stylelint"), "")
    .replace(/\\/g, "/")
    .substring(1);

  return `---
title: ${title}
sidebar_label: ${sidebarLabel}
hide_title: true
custom_edit_url: https://github.com/stylelint/stylelint/edit/master/${editPath}
---

${content}`;
}

// For Docusaurus. See https://docusaurus.io/docs/en/navigation
function generateSidebarsJson(outputDir, rulesDir) {
  const json = JSON.parse(
    fs.readFileSync(path.join(__dirname, "sidebars-template.json"), "utf8")
  );

  const filter = ["about.md", "combine.md", "regex.md", "list.md"];

  json.docs.Rules = fs
    .readdirSync(path.join(outputDir, rulesDir))
    .filter(filename => !filter.includes(filename))
    .map(filename => `${rulesDir}/${path.basename(filename, ".md")}`)
    .sort();

  const outputFile = path.join("website", "sidebars.json");

  fs.writeFileSync(outputFile, JSON.stringify(json, null, 2), "utf8");
}

function addHostingInfo(content) {
  return `${content}

## Hosting

<a href="https://www.netlify.com">
  <img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg" alt="Deploys by Netlify">
</a>
`;
}

function main(outputDir) {
  fs.mkdirSync(outputDir);

  glob.sync("node_modules/stylelint/*.md").forEach(file => {
    let output = processMarkdown(file, {
      rewriter: url =>
        url.replace(/^\/?docs\//, "").replace("README.md", "index.md")
    });

    if (file.includes("README.md")) {
      output = addHostingInfo(output);
    }

    const outputFile = path.join(
      outputDir,
      file
        .replace("node_modules/stylelint", "")
        .replace("README.md", "index.md")
    );

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });

    fs.writeFileSync(outputFile, output, "utf8");
  });

  glob.sync("node_modules/stylelint/docs/**/!(toc).md").forEach(file => {
    const output = processMarkdown(file, {
      rewriter: url =>
        url
          .replace(
            "../../lib/rules/index.js",
            "https://github.com/stylelint/stylelint/blob/master/lib/rules/index.js"
          )
          .replace("../../CHANGELOG.md", "../CHANGELOG.md")
          .replace("../../VISION.md", "../VISION.md")
          .replace("../../lib/rules/", "rules/")
          .replace("/README.md", ".md")
    });

    const outputFile = path.join(
      outputDir,
      file.replace("node_modules/stylelint/docs", "")
    );

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });

    fs.writeFileSync(outputFile, output, "utf8");
  });

  glob.sync("node_modules/stylelint/lib/rules/**/*.md").forEach(file => {
    const output = processMarkdown(file, {
      rewriter: url =>
        url
          .replace(/\.\.\/([a-z-]+)\/README.md/, "$1.md")
          .replace(
            /\.\.\/\.\.\/\.\.\/docs\/user-guide\/([a-z-/]+)\.md/,
            "../$1.md"
          )
    });

    const outputFile = path.join(
      outputDir,
      file
        .replace("node_modules/stylelint/lib/rules", "user-guide/rules")
        .replace("/README.md", ".md")
    );

    fs.mkdirSync(path.dirname(outputFile), { recursive: true });

    fs.writeFileSync(outputFile, output, "utf8");
  });

  generateSidebarsJson(outputDir, "user-guide/rules");

  console.log("Documents have been generated.");
}

main(process.argv[2]);
