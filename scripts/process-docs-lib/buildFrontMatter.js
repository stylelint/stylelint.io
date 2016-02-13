import addNewline from "./addNewline"
import toYAML from "./toYAML"

const getTitle = function(contents) {
  const m = contents.match(/#\s?(.*)/)
  if (m) return m[1]
}

export default function(path, contents, properties) {
  const newProps = properties || {
    title: getTitle(contents),
  }

  return addNewline(toYAML(newProps))
}
