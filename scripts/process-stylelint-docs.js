import glob from "glob"
import processFrontMatter from "./process-docs-lib/processFrontMatter"
import processLinks from "./process-docs-lib/processLinks"

processFrontMatter(glob.sync("content/**/*.md"))

processLinks(glob.sync("content/**/*.md"))
processLinks(glob.sync("content/*.md"))
