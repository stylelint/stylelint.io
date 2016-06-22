import fs from "fs"
import buildFrontMatter from "./buildFrontMatter"
import prependFrontMatter from "./prependFrontMatter"

export default function(paths, properties) {
  paths.forEach(function(path) {
    const contents = fs.readFileSync(path, "utf-8")
    const frontMatter = buildFrontMatter(path, contents, properties)

    const newContents = prependFrontMatter(frontMatter, contents)
    fs.writeFileSync(path, newContents)
  })
}
