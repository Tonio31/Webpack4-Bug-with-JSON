const webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const config = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const PurifyCSSPlugin = require('purifycss-webpack');

module.exports = (iPhase) => {
  config.output = {
    filename: '[name].bundle.js',
    publicPath: 'https://webpl.ciprianspiridon.com/',
    path: path.resolve(__dirname, 'dist')
  };

  config.module.loaders = config.module.loaders.concat([
    {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract("style-loader", "css-loader")
    },
  ]);

  config.plugins = config.plugins.concat([

    new ExtractTextPlugin("[name].css"),

    new PurifyCSSPlugin({
      paths: glob.sync(path.join(__dirname, "client/**/*.html"))
    }),

    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: 'client/index.html',
      inject: 'body',
      hash: true,
      favicon: 'client/app/common/favicon/favicon.ico'
    }),


    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify(iPhase)
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
    })

  ]);

  return config;
};
