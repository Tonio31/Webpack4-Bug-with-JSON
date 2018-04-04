const webpack = require('webpack');
const glob = require('glob');
const path = require('path');
const config = require('./webpack.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const WebpackAutoInject = require('webpack-auto-inject-version');


let websiteConfig = {
  DOCKER: {
    websiteUrl: '',
    mode: 'development',
    apiUrl: 'http://api.pl.localhost/',
    apiVersion: 'v1',
    googleTrackingCode: 'UA-57685355-4',
    viaSurveyAppKey: 'F1206FA8-6CEA-4E67-97CE-611B925D50C4', // Test key (same as localhost)
    brochureWebsiteUrl: 'https://pl.dev'
  },
  UAT: {
    websiteUrl: '',
    mode: 'production',
    apiUrl: 'https://test-api.potentialife.com/',
    apiVersion: 'v1',
    googleTrackingCode: 'UA-57685355-4',
    viaSurveyAppKey: 'F1206FA8-6CEA-4E67-97CE-611B925D50C4', // Test key
    brochureWebsiteUrl: 'https://potentialife.com' // Will change as soon as we have UAT for this site
  },
  PROD: {
    websiteUrl: '',
    mode: 'production',
    apiUrl: 'https://api.potentialife.com/',
    apiVersion: 'v1',
    googleTrackingCode: 'UA-57685355-5',
    viaSurveyAppKey: 'F9C66D59-4551-4564-AFD5-31384735A4B8',
    brochureWebsiteUrl: 'https://potentialife.com'
  }
};

module.exports = (iPhase) => {
  config.output = {
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
    publicPath: websiteConfig[iPhase].websiteUrl,
    path: path.resolve(__dirname, 'dist')
  };

  config.mode = websiteConfig[iPhase].mode;

  config.module.rules = config.module.rules.concat([
    {
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          'postcss-loader',
        ]
      })

    },
    {
      test: /\.(scss|sass)/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
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
      })
    },
    {
      test: /\.html$/,
      use: [
        {
          loader: 'raw-loader',
          options: {
            minimize: true
          }
        }
      ]
    },
  ]);


  config.plugins = config.plugins.concat([


    new ExtractTextPlugin({
      filename: "[name].css",
      allChunks: false
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
      ENVIRONMENT: JSON.stringify(iPhase),
      GOOGLE_TRACKING_CODE: JSON.stringify(websiteConfig[iPhase].googleTrackingCode),
      BACK_END_API: JSON.stringify(`${websiteConfig[iPhase].apiUrl}${websiteConfig[iPhase].apiVersion}`),
      VIA_SURVEY_APP_KEY: JSON.stringify(websiteConfig[iPhase].viaSurveyAppKey),
      BROCHURE_HOME_URL: JSON.stringify(websiteConfig[iPhase].brochureWebsiteUrl)
    }),

    new WebpackAutoInject({
      components: {
        AutoIncreaseVersion: false
      }
    }),

  ]);

  return config;
};
