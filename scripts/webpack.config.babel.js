import path from "path"
import webpack from "webpack"
import ExtractTextPlugin from "extract-text-webpack-plugin"

import config from "./config.js"

export default ({ config, pkg }) => ({
  module: {
    loaders: [
      { // statinamic requirement
        test: /\.md$/,
        loader: "statinamic/lib/content-loader",
        query: {
          context: path.join(config.cwd, config.source),
        },
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          "style-loader",
        // loader:
        //   "style-loader" +
        //   "!" +
          "css-loader" +
            "?modules"+
            "&localIdentName=[path][name]--[local]--[hash:base64:5]" +
          "!" +
          "postcss-loader",
        ),
      },
      {
        test: /\.(html|ico|jpe?g|png|gif)$/,
        loader: "file-loader" +
          "?name=[path][name].[ext]&context=" +
          path.join(config.cwd, config.destination),
      },

      {
        test: /\.svg$/,
        loader: "raw-loader",
      },

      // client side specific loaders are located in webpack.config.client.js
    ],
  },

  postcss: () => [
    require("stylelint")(),
    require("postcss-cssnext")({ browsers: "last 2 versions" }),
    require("postcss-browser-reporter")(),
    require("postcss-reporter")(),
  ],

  plugins: [
    new ExtractTextPlugin("[name].[hash].css", { disable: config.dev }),
    new webpack.DefinePlugin({ "process.env": {
      NODE_ENV: JSON.stringify(
        config.production ? "production" : process.env.NODE_ENV
      ),
      STATINAMIC_PATHNAME: JSON.stringify(process.env.STATINAMIC_PATHNAME),
    } }),

    ...config.production && [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
    ],
  ],

  output: {
    path: path.join(config.cwd, config.destination),
    publicPath: config.baseUrl.pathname,
    filename: "[name].[hash].js",
  },
})
