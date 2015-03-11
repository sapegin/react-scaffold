var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
  entry: {
    app: [
      'webpack-dev-server/client?http://localhost:8080',
      'webpack/hot/only-dev-server',
      './src/main.js'
    ],
    vendor: [
      // 'react',
      // 'lodash',
      // 'reflux',
      // 'immutable',
      // 'superagent'
    ]
  },
  output: {
    path: './build',
    filename: "bundle.js"
  },
  module: {
    loaders: [
      { test: /\.coffee$/, loader: "coffee-loader" },
      { test: /\.(js|jsx)$/, loaders: ['react-hot', 'babel'], exclude: /node_modules/},
      { test: /\.json$/, loader: 'json' },
      { test: /\.css$/, loader: 'style-loader!css' },
      { test: /\.(png|woff)$/, loader: 'url-loader?limit=100000' }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js"),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};

module.exports = config;
