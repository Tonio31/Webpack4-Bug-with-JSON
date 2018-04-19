const webpack = require('webpack');
const path = require('path');
const config = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');

module.exports = () => {

  config.output = {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: '/',
    path: path.resolve(__dirname, 'client')
  };

  config.mode = 'development';

  config.module.rules = config.module.rules.concat([
    {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader',
        'postcss-loader',
      ]
    },
    {
      test: /\.(scss|sass)/,
      use: [
        {
          loader: 'style-loader',
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            sourceMap: true
          }
        },
        {
          loader: 'sass-loader',
          options: {
            includePaths: [ path.resolve(__dirname, './client/app') ],
            sourceMap: true
          }
        },
      ]
    },
    {
      test: /\.html$/,
      use: [
        {
          loader: 'raw-loader',
          options: {
            minimize: false
          }
        }
      ]
    },
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
    }),


    new webpack.DefinePlugin({
      ENVIRONMENT: JSON.stringify('development'),
      GOOGLE_TRACKING_CODE: JSON.stringify('UA-96100387-1'),
      BACK_END_API: JSON.stringify(`https://localhost.com`),
      VIA_SURVEY_APP_KEY: JSON.stringify('F1206FA8-6CEA-4E67-97CE-611B925D50C4'), // Test Key
      BROCHURE_HOME_URL: JSON.stringify(`https://pl.dev`)
    }),

    // Adds webpack HMR support. It act's like livereload,
    // reloading page after webpack rebuilt modules.
    // It also updates stylesheets and inline assets without page reloading.
    new webpack.HotModuleReplacementPlugin(),

    // displays desktop notifications on MacOS
    new WebpackNotifierPlugin(),
  ]);

  return config;
};
