var webpack = require('webpack');
var path = require('path');
var nodeModulesPath = path.resolve(__dirname, 'node_modules');

var config = {
  entry: path.resolve(__dirname, 'src/admin/admin.main.jsx'),
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  output: {
    path: path.resolve(__dirname, 'public/scripts'),
    filename: 'admin2.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  module: {
    preLoaders: [{
        //Eslint loader
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: [path.resolve(__dirname, "src/admin")],
        exclude: /node_modules/
      }],
    loaders: [{
      test: /\.(js|jsx)?$/,
      loader: 'babel-loader',
      include: [path.resolve(__dirname, "src/admin")],
      exclude: /node_modules/,
      query: {
        presets: ['es2015', 'react']
      }
    }]
  },
  eslint: {
    configFile: '.eslintrc'
  },
};

module.exports = config;
