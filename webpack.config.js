const {join} = require('path');
const externals = require(join(process.cwd(), 'package.json')).dependencies;

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    background: './main/index.js',
  },
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.node'],
    modules: [join(process.cwd(), 'app'), 'node_modules'],
  },
  externals: [...Object.keys(externals)],
  output: {
    filename: 'index.js',
    path: join(process.cwd(), 'app'),
    libraryTarget: 'commonjs2',
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: 'node-loader',
      },
    ],
  },
};