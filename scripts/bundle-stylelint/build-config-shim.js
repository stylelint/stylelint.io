"use strict"

module.exports = function(options) {
  if (options.config) {
    return Promise.resolve({ config: options.config })
  }

  return Promise.reject(new Error("Unable to build stylelint config"))
}
