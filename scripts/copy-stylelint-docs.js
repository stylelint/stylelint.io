const fs = require("fs-extra")
const glob = require("glob")
const path = require("path")

// Copy /docs
fs.copySync("node_modules/stylelint/docs", "content")

// Copy rule READMEs
const rules = glob.sync("node_modules/stylelint/lib/rules/**/README.md")

rules.forEach(function(file, index) {

  const rulePath = `content/user-guide/rules/${path.dirname(file).split("/").pop()}.md`;
  let nextRulePath = null;
  let prevRulePath = null;

  if ( rules[index+1] ) {
    nextRulePath = `/user-guide/rules/${path.dirname(rules[index+1]).split("/").pop()}/`;
  }

  if ( rules[index-1] ) {
    prevRulePath = `/user-guide/rules/${path.dirname(rules[index-1]).split("/").pop()}/`;
  }

  fs.copySync(file, rulePath);

  fs.readFile(rulePath, 'utf8', function(err, data){
    if (err) throw err

    fs.writeFile(rulePath, `---\nlayout: RulePage\nnext: ${nextRulePath}\nprev: ${prevRulePath}\n---` + data)
  })
})

// Copy root files (README, CHANGELOG etc)
const rootFiles = glob.sync("node_modules/stylelint/*.md")
rootFiles.forEach(function(file) {
  fs.copySync(file, `content/${path.basename(file)}`)
})

// Rename main readme
fs.renameSync("content/README.md", "content/index.md")

// Create demo.md
const demo = `---
title: Demo
description: Try stylelint in your browser
layout: DemoPage
---
`
const demoPath = "content/demo"
if (!fs.existsSync(demoPath)) { fs.mkdirSync(demoPath) }
fs.writeFileSync(`${demoPath}/index.md`, demo)
