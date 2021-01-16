require('dotenv').config();
const path = require("path");
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// `CheckerPlugin` is optional. Use it if you want async error reporting.
// We need this plugin to detect a `--watch` mode. It may be removed later
// after https://github.com/webpack/webpack/issues/3460 will be resolved.
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
  entry: {
    'community-directory': "./src/Scripts/index.ts",
    'community-directory-admin': './src/Admin/Scripts/index.ts',
  },
  mode: process.env.ENVIRONMENT,
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, "assets/dist"),
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader", // translates CSS into CommonJS
          },
          {
            loader: "stylus-loader", // compiles Stylus to CSS
            options: {
              stylusOptions: {
                use: [require("nib")()],
                import: ["nib"],
              },
            },
          },
        ],
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf$|\.wav$|\.mp3$/,
        use: "file-loader"
      },
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  // watch: true,
  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
    ignored: ['node_modules/**', 'assets/**']
  },
  resolve: {
    extensions: [".ts", ".styl", ".jpg", ".svg", ".png", ".jpeg"],
    alias: {
      'ThirdParty': path.resolve(__dirname, 'src/Scripts/ThirdParty/'),
      'Scripts': path.resolve(__dirname, 'src/Scripts/'),
      'views': path.resolve(__dirname, 'src/views/'),
      'Admin': path.resolve(__dirname, 'src/Admin/'),
      'assets': path.resolve(__dirname, 'assets/'),
    },
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new CheckerPlugin(),
  ]
};
