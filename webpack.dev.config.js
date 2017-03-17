var webpack = require('webpack');
var path    = require('path');
var config  = require('./webpack.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = () => {

  config.output = {
    filename: '[name].bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, 'client')
  };

  config.plugins = config.plugins.concat([

    // Injects bundles in your index.html instead of wiring all manually.
    // It also adds hash to all injected assets so we don't have problems
    // with cache purging during deployment.
    new HtmlWebpackPlugin({
      template: 'client/indexMockBackEnd.html',
      //template: 'client/index.html',
      inject: 'body',
      hash: true
    }),

    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify('development')
    }),

    // Adds webpack HMR support. It act's like livereload,
    // reloading page after webpack rebuilt modules.
    // It also updates stylesheets and inline assets without page reloading.
    new webpack.HotModuleReplacementPlugin()
  ]);

  return config;
};
