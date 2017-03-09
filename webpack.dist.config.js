const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssSourcemapPlugin = require('css-sourcemaps-webpack-plugin');

config.output = {
  filename: '[name].bundle.js',
  publicPath: '',
  path: path.resolve(__dirname, 'dist')
};

config.plugins = config.plugins.concat([

  // Injects bundles in your index.html instead of wiring all manually.
  // It also adds hash to all injected assets so we don't have problems
  // with cache purging during deployment.
  new HtmlWebpackPlugin({
    template: 'client/index.html',
    inject: 'body',
    hash: true
  }),

  new webpack.DefinePlugin({
    ENVIRONMENT: JSON.stringify('production')
  }),

  // Reduces bundles total size
  new webpack.optimize.UglifyJsPlugin({
    mangle: {

      // You can specify all variables that should not be mangled.
      // For example if your vendor dependency doesn't use modules
      // and relies on global variables. Most of angular modules relies on
      // angular global variable, so we should keep it unchanged
      except: ['$super', '$', 'exports', 'require', 'angular']
    }
  }),

  new CssSourcemapPlugin({ disable: true })
]);

module.exports = config;
