'use strict';
var path = require('path');
var webpack = require('webpack');

var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var ENV = process.env.npm_lifecycle_event;
var isProd = ENV === 'build';

module.exports = {
  entry: {
    'dialog-dev': ['scripts/dialog-dev.ts'],
    background: ['scripts/background.ts'],
    content: ['scripts/content.ts'],
    popup: ['scripts/popup.ts'],
  },

  context: path.join(process.cwd(), 'src'),

  output: {
    path: path.join(process.cwd(), 'dist'),
    filename: 'scripts/[name].js',
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      },
      {
        enforce: 'pre',
        test: /\.ts$/,
        loader: 'tslint-loader',
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader!sass-loader',
        }),
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: 'assets/popup.html',
      chunks: ['popup', 'commons'],
      chunksSortMode: 'dependency',
      filename: 'popup.html'
    }),

    new HtmlWebpackPlugin({
      template: 'assets/dialog-dev.html',
      chunks: ['dialog-dev', 'commons'],
      chunksSortMode: 'dependency',
      filename: 'dialog-dev.html'
    }),

    new ExtractTextPlugin({
      filename: 'css/[name].css',
      disable: !isProd,
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      filename: 'scripts/[name].js'
    }),

    new CopyWebpackPlugin([{ from: 'assets' }]),
  ],

  resolve: {
    modules: ['node_modules', path.resolve(process.cwd(), 'src')],
    extensions: ['.ts', '.js', 'scss'],
  },

  devServer: {
    contentBase: path.join(process.cwd(), 'dist'),
    clientLogLevel: 'info',
    port: 8080,
    inline: true,
    historyApiFallback: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: 500,
    },
  },

  devtool: 'source-map',
};
