import webpack from "webpack"
import path from "path"

export default {
  entry: path.join(__dirname, "stylelint-browser-bundle.js"),
  output: {
    path: path.resolve(__dirname, "..", "..", "lib"),
    filename: "stylelint-browser-bundle.js",
    libraryTarget: "commonjs2",
    library: "StylelintBrowserBundle",
  },
  resolve: {
    root: [ path.resolve(__dirname) ],
    alias: {
      "cosmiconfig": "empty-module",
      "doiuse": "empty-module",
      "globby": "empty-module",
      "globjoin": "empty-module",
      "multimatch": "empty-module",
      "path": "empty-module",
      "resolve-from": "empty-module",
    },
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.json$/,
        loader: "json-loader",
      },
    ],
  },
  plugins: [
    // resolve.alias does not resolve relative require statements, replace the
    // buildConfig module via this plugin instead
    new webpack.NormalModuleReplacementPlugin(
      /buildConfig\.js$/,
      path.resolve(__dirname, "build-config-shim.js")
    ),
    // stylelint's postcssPlugin dynamically requires stylelint plugins which
    // are not used in the browser. Tell Webpack to ignore them. See
    // https://github.com/webpack/webpack/issues/198
    new webpack.ContextReplacementPlugin(/stylelint/, /NEVER_MATCH^/),
  ],
  node: {
    fs: "empty",
    module: "empty",
  },
}
