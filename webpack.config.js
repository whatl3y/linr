var nodeExternals = require('webpack-node-externals')

module.exports = {
  mode: 'production',
  entry: [
    'core-js/stable',
    'regenerator-runtime/runtime',
    './src/linr.js'
  ],
  target: 'node',
  output: {
    filename: 'linr',
  },
  externals: [ nodeExternals() ],
  module: {
    rules: [{
      test: /\.m?js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
}
