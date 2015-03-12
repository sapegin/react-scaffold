var path = require('path');
var bourbon = require('node-bourbon').includePaths;
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './src/scripts/main.js'
    ],
    vendor: [
      'react',
      'jquery',
      'asyncQueue'
    ]
  },
  output: {
    path: './build',
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      'asyncQueue': 'rygr.async-queue/rygr.async-queue.browser.js'
    }
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.(js|jsx)$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/},
      { test: /\.json$/, loader: 'json' },
      { test: /\.(png|woff)$/, loader: 'url-loader?limit=100000' },
      { test: /\.css$/, loader: 'style-loader!css' },
      {
        test: /\.scss$/,
        loader: "style!css!sass?includePaths[]=" + bourbon + "&" +
                "includePaths[]=" + (path.resolve(__dirname, "./node_modules"))
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};

module.exports = config;
