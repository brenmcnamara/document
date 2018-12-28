const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const path = require('path');

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
  },

  // TODO: Adding babel-polyfill to get around regeneratorruntime
  // error when trying to use async / await syntax. Importing
  // babel-polyfill is giving me warnings because it is imported
  // multiple times, which can result in conflicting versions getting
  // set. Need to address this issue at a later point, hopefully the
  // regeneratorruntime bug will get resolved soon.
  entry: ['@babel/polyfill/noConflict', './src/index.js'],

  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  mode: 'development',

  module: {
    rules: [
      {
        exclude: /(node_modules)/,
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
    ],
  },

  plugins: [
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, 'node_modules/normalize.css/normalize.css'),
        to: path.join(__dirname, 'dist/normalize.css'),
      },
    ]),
    new HtmlWebpackPlugin({ template: './index.html' }),
  ],
};
