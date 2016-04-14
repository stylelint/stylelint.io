import fs from "fs"

export default function(paths) {
  paths.forEach(function(path) {

    let contents = fs.readFileSync(path, "utf-8")

    contents = contents.replace(/\.md/g, "/")
    contents = contents.replace(/docs\//g, "")
    contents = contents.replace(/\/README/g, "")
    contents = contents.replace(/\.\.\/\.\.\/src\/rules\//g, "")

    fs.writeFileSync(path, contents)
  })
}
