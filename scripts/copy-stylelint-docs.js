import fs from "fs-extra"
import glob from "glob"
import path from "path"

// copy docs
fs.copySync("node_modules/stylelint/docs", "content")

// copy rules
const rules = glob.sync("node_modules/stylelint/src/rules/**/README.md")
rules.forEach(function(file) {
  fs.copySync(file,
    "content/user-guide/rules/"
    + path.dirname(file).split("/").pop()
    + ".md"
  )
})

// copy root files
const rootFiles = glob.sync("node_modules/stylelint/*.md")
rootFiles.forEach(function(file) {
  fs.copySync(file,
    "content/"
    + path.basename(file)
  )
})

// rename main readme
fs.renameSync("content/README.md", "content/index.md")
