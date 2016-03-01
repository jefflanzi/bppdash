var path = require('path');
var webpack = require('webpack');

var config = {
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/only-dev-server',
    path.resolve(__dirname, 'src/admin/Admin.jsx'),
  ],
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  output: {
    publicPath: "http://localhost:8080/scripts/",
    path: path.resolve(__dirname, 'public/scripts'),
    filename: 'admin.js'
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)?$/,
      loader: 'babel-loader',
      include: path.resolve(__dirname, "src/admin"),
      exclude: path.resolve(__dirname, "node_modules")
    }]
  },
  devServer: {
    contentBase: 'http://localhost:3000',
    hot:true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({
      'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
    })
  ]
};

module.exports = config;
