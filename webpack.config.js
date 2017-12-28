import path from "path";

import webpack from "webpack";
import ExtractTextPlugin from "extract-text-webpack-plugin";
import { phenomicLoader } from "phenomic";
import PhenomicLoaderSitemapWebpackPlugin from "phenomic/lib/loader-sitemap-webpack-plugin";

import pkg from "./package.json";

export default (config = {}) => {
  return {
    ...(config.dev && {
      devtool: "#cheap-module-eval-source-map"
    }),
    module: {
      noParse: /\.min\.js/,
      rules: [
        // *.md => consumed via phenomic special webpack loader
        // allow to generate collection and rss feed.
        {
          // phenomic requirement
          test: /\.(md|markdown)$/,
          loader: phenomicLoader,
          query: {
            context: path.join(__dirname, config.source),
            plugins: [
              ...require("phenomic/lib/loader-preset-default").default,
              require("phenomic/lib/loader-plugin-markdown-init-head.description-property-from-content")
                .default,
              require("./plugins/loader-plugin-markdown-init-head.title-property-from-content")
                .default,
              require("./plugins/loader-plugin-markdown-transform-body-property-to-html")
                .default
            ]
          }
        },

        // *.js => babel + eslint
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, "scripts"),
            path.resolve(__dirname, "src")
          ],
          loaders: [
            "babel-loader?cacheDirectory",
            "eslint-loader" + (config.dev ? "?emitWarning" : "")
          ]
        },

        // ! \\
        // by default *.css files are considered as CSS Modules
        // And *.global.css are considered as global (normal) CSS

        // *.css => CSS Modules
        {
          test: /\.css$/,
          exclude: /\.global\.css$/,
          include: path.resolve(__dirname, "src"),
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: "css-loader",
                query: {
                  modules: true,
                  localIdentName: config.production
                    ? "[hash:base64:5]"
                    : "[path][name]--[local]--[hash:base64:5]"
                }
              },
              {
                loader: "postcss-loader"
              }
            ]
          })
        },
        // *.global.css => global (normal) css
        {
          test: /\.global\.css$/,
          include: path.resolve(__dirname, "src"),
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              "css-loader",
              {
                loader: "postcss-loader"
              }
            ]
          })
        },
        // ! \\
        // If you want global CSS only, just remove the 2 sections above
        // and use the following one
        // ! \\ If you want global CSS for node_modules only, just uncomment
        // this section and the `include` part
        /*
        {
          test: /\.css$/,
          // depending on your need, you might need to scope node_modules
          // for global CSS if you want to keep CSS Modules by default
          // for your own CSS. If so, uncomment the line below
          // include: path.resolve(__dirname, "node_modules"),
          loader: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              "css-loader",
              {
                loader: "postcss-loader",
                query: { "plugins": postcssPlugins },
              },
            ]
          }),
        },
        */
        // ! \\ if you want to use Sass or LESS, you can add sass-loader or
        // less-loader after postcss-loader (or replacing it).
        // ! \\ You will also need to adjust the file extension
        // and to run the following command
        //
        // Sass: `npm install --save-dev node-sass sass-loader`
        // https://github.com/jtangelder/sass-loader
        //
        // LESS: npm install --save-dev less less-loader
        // https://github.com/webpack/less-loader

        // copy assets and return generated path in js
        {
          test: /\.(html|ico|jpe?g|png|gif|eot|otf|webp|ttf|woff|woff2)$/,
          loader: "file-loader",
          query: {
            name: "[path][name].[hash].[ext]",
            context: path.join(__dirname, config.source)
          }
        },

        // svg as raw string to be inlined
        {
          test: /\.svg$/,
          loader: "raw-loader"
        }
      ]
    },

    plugins: [
      new PhenomicLoaderSitemapWebpackPlugin({
        site_url: pkg.homepage
      }),

      new ExtractTextPlugin({
        filename: "[name].[hash].css",
        disable: config.dev
      }),

      ...(config.production && [
        new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false } })
      ])
    ],

    output: {
      path: path.join(__dirname, config.destination),
      publicPath: config.baseUrl.pathname,
      filename: "[name].[hash].js"
    },

    resolve: { extensions: [".js", ".json"] }
  };
};
