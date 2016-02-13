export default function(frontMatter, contents) {
  if ((/^---/).test(contents)) {
    return contents
  }
  else {
    return frontMatter + contents
  }
}
