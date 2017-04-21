const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CssSourcemapPlugin = require('css-sourcemaps-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = () => {

  config.output = {
    filename: '[name].bundle.js',
    publicPath: 'http://localhost:3000/',
    path: path.resolve(__dirname, 'client')
  };

  config.module.loaders = config.module.loaders.concat([
    {
      test: /\.css$/,
      loader: 'style!css!postcss'
    },
    {
      test: /\.(scss|sass)$/,
      loader: 'style!css!postcss!sass'
    }
  ]);

  config.plugins = config.plugins.concat([

    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: 'client/indexMockBackEnd.html',
      //template: 'client/index.html',
      inject: 'body',
      hash: true,
      favicon: 'client/app/common/favicon/favicon.ico'
    }),


    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify('development')
    }),

    // Adds webpack HMR support. It act's like livereload,
    // reloading page after webpack rebuilt modules.
    // It also updates stylesheets and inline assets without page reloading.
    new webpack.HotModuleReplacementPlugin(),

    new CssSourcemapPlugin(),

    // displays desktop notifications on MacOS
    new WebpackNotifierPlugin()

  ]);

  return config;
};
