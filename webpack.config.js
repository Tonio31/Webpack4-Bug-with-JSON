const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {},
  resolve: {
    modules: [
      path.resolve(__dirname),
      path.resolve(__dirname, 'node_modules')
    ],
    extensions: [ '.js' ],
    alias: {
      app: 'client/app',
      common: 'client/app/common',
      components: 'client/app/components'
    }
  },

  cache: true, // better performance for the AggressiveSplittingPlugin
  module: {

    rules : [
      {
        test: /\.js$/,
        exclude: [ /app\/lib/, /node_modules/],
        enforce: 'pre',
        use: [
          {
            loader: 'eslint-loader',
            options: {
              failOnWarning: false,
              failOnError: true
            }
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: [ /app\/lib/, /node_modules/],
        use: [
          {
            loader: 'ng-annotate-loader?add=true&single_quotes=true'
          },
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.svg/,
        use: [
          {
            loader: 'svg-url-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg)$/,
        use: [
          {
            loader: 'url-loader?limit=1024'
          }
        ]
      },
      {
        test: /\.woff$/,
        use: [
          {
            loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=public/fonts/[name].[ext]'
          }
        ]
      },
      {
        test: /\.woff2$/,
        use: [
          {
            loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]'
          }
        ]
      },
      {
        test: /\.[ot]tf$/,
        use: [
          {
            loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]'
          }
        ]
      },
      {
        test: /\.eot$/,
        use: [
          {
            loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=public/fonts/[name].[ext]'
          }
        ]
      }
    ],

    noParse: [
      '/node_modules/d3-cloud/build/d3.layout.cloud.js',
    ]
  },
  plugins: [

    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   description: 'vendor',
    //   minChunks: function (module, count) {
    //     return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
    //   }
    // }),

    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require("./package.json").version)
    }),

    new webpack.ProvidePlugin({
      c3: 'c3',
      Bugsnag: 'bugsnag-js'
    }),

    // This is used to have a banner shown to the user to "Add to home screen"
    // It works with the service-worker called in app.js
    new CopyWebpackPlugin([
      {
        from: './config',
        to: path.resolve(__dirname, 'dist/')
      },
      {
        from: './assets/**/*',
        to: path.resolve(__dirname, 'dist/')
      },
    ]),
  ],

  optimization: {
    namedModules: true, // NamedModulesPlugin()
    splitChunks: {
      chunks: "all"
    },
    runtimeChunk: true,
    concatenateModules: true //ModuleConcatenationPlugin
  }
};
