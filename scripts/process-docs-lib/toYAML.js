import wrap from "./wrap"
import addNewline from "./addNewline"

export default function(obj) {
  const keys = Object.keys(obj)

  const str = keys.map(function(k) {
    return [ k, obj[k] ].join(": ")
  })
  .map(addNewline)
  .join("")

  return wrap("---\n", function() {
    return str
  })
}
