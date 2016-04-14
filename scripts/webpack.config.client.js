import path from "path"
import webpack from "webpack"

// ! client side loader only \\
export default ({ config }) => {
  const { webpackConfig } = config
  return {
    ...webpackConfig,
    module: {
      ...webpackConfig.module,
      loaders: [
        ...webpackConfig.module.loaders,
        {
          test: /\.json$/,
          loader: "json-loader",
        },
        {
          test: /\.js$/,
          loaders: [
            `babel-loader${
              config.dev ? "?presets[]=babel-preset-react-hmre" : ""
            }`,
            "eslint-loader?fix",
          ],
          include: [
            path.resolve(config.cwd, "scripts"),
            path.resolve(config.cwd, "web_modules"),
          ],
        },
      ],
    },

    noParse: [ /stylelint-browser-bundle/, /react-codemirror/, /codemirror/ ],

    entry: {
      "phenomic-client": path.join(__dirname, "index-client"),
    },

    plugins: [
      ...webpackConfig.plugins,
      new webpack.optimize.CommonsChunkPlugin(
        "phenomic-client",
        "[name].[hash].js",
        Infinity,
      ),
    ],
  }
}
