import path from "path"

import webpack from "webpack"
import ExtractTextPlugin from "extract-text-webpack-plugin"

export const makeConfig = (config = {}) => {
  return {
    ...config.dev && {
      devtool: "#cheap-module-eval-source-map",
    },
    module: {
      noParse: /\.min\.js/,
      loaders: [
        {
          // phenomic requirement
          test: /\.md$/,
          loader: "phenomic/lib/content-loader",
        },
        {
          test: /\.json$/,
          loader: "json-loader",
        },
        {
          test: /\.js$/,
          loaders: [
            `babel-loader${
              config.dev
              ? "?cacheDirectory=true&presets[]=babel-preset-react-hmre"
              : "?cacheDirectory=true"
            }`,
            "eslint-loader?fix",
          ],
          include: [
            path.resolve(__dirname, "scripts"),
            path.resolve(__dirname, "web_modules"),
          ],
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract(
            "style-loader",
            "css-loader" + (
              "?modules"+
              "&localIdentName=" +
              (
                process.env.NODE_ENV === "production"
                ? "[hash:base64:5]"
                : "[path][name]--[local]--[hash:base64:5]"
              ).toString()
            ) + "!" +
            "postcss-loader",
          ),
        },
        {
          test: /\.(html|ico|jpe?g|png|gif)$/,
          loader: "file-loader" +
            "?name=[path][name].[ext]&context=" +
            path.join(__dirname, config.source),
        },
        {
          test: /\.svg$/,
          loader: "raw-loader",
        },
      ],
    },

    phenomic: {
      contentLoader: {
        context: path.join(__dirname, config.source),
      },
    },

    postcss: () => [
      require("stylelint")(),
      require("postcss-cssnext")({ browsers: "last 2 versions" }),
      require("postcss-browser-reporter")(),
      require("postcss-reporter")(),
    ],

    plugins: [
      new ExtractTextPlugin("[name].[hash].css", { disable: config.dev }),
      ...config.production && [
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin(
          { compress: { warnings: false } }
        ),
      ],
    ],

    output: {
      path: path.join(__dirname, config.destination),
      publicPath: config.baseUrl.pathname,
      filename: "[name].[hash].js",
    },

    resolve: {
      extensions: [ ".js", ".json", "" ],
      root: [ path.join(__dirname, "node_modules") ],
    },
    resolveLoader: { root: [ path.join(__dirname, "node_modules") ] },
  }
}
