import wrap from "./wrap"
import addNewLine from "./addNewLine"

export default function(obj) {
  const keys = Object.keys(obj)

  const str = keys.map(function(k) {
    return [ k, obj[k] ].join(": ")
  })
  .map(addNewLine)
  .join("")

  return wrap("---\n", function() {
    return str
  })
}
