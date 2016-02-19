var path = require('path');

var config = {
  entry: path.resolve(__dirname, 'src/admin/admin.main.jsx'),
  resolve: {
    extensions: ["", ".js", ".jsx"]
  },
  output: {
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
  }
};

module.exports = config;
