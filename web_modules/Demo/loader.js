"use strict"

// Allow Demo component to be required at run-time
// See https://webpack.github.io/docs/code-splitting.html
export default () => {
  return new Promise(resolve => {
    require.ensure([], () => {
      require("./index.css")

      resolve({
        Demo: require("./index.js"),
      })
    })
  })
}
