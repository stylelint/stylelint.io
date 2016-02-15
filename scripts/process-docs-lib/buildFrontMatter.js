import addNewLine from "./addNewLine"
import toYAML from "./toYAML"

const getTitle = function(contents) {
  const m = contents.match(/#\s?(.*)/)
  if (m) return m[1]
}

export default function(path, contents, properties) {
  const newProps = properties || {
    title: getTitle(contents),
  }

  return addNewLine(toYAML(newProps))
}
