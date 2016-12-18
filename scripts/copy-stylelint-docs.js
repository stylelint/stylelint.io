const fs = require("fs-extra")
const glob = require("glob")
const path = require("path")

// Copy /docs
fs.copySync("node_modules/stylelint/docs", "content")

// Copy rule READMEs
const rules = glob.sync("node_modules/stylelint/lib/rules/**/README.md")
rules.forEach(function(file) {
  fs.copySync(file, `content/user-guide/rules/${path.dirname(file).split("/").pop()}.md`)
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
