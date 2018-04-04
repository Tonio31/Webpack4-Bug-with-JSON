var path    = require('path');
const webpack = require('webpack');

module.exports = function (config) {


  config.set({
    // base path used to resolve all patterns
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: [
      'mocha',
      'sinon-chai'
    ],

    client : {
      chai: {
        truncateThreshold: 0
      }
    },

    // list of files/patterns to load in the browser
    files: [
      { pattern: 'spec.bundle.js', watched: false }
    ],

    // files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { 'spec.bundle.js': ['webpack', 'sourcemap'] },

    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
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
                  failOnError: true,
                  configFile: ".eslintrc.spec.js"
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
            test: /\.html$/,
            use: [
              {
                loader: 'raw-loader'
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
          },
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
          }
        ],
        noParse: [
          '/node_modules/d3-cloud/build/d3.layout.cloud.js',
        ]
      },
      plugins: [
        new webpack.DefinePlugin({
          ENVIRONMENT: JSON.stringify('development'),
          VERSION: JSON.stringify('99.99.99'),
          GOOGLE_TRACKING_CODE: JSON.stringify('Whatever'),
          BACK_END_API: JSON.stringify(`https://localhost.com`),
          VIA_SURVEY_APP_KEY: JSON.stringify('Whatever'),
          BROCHURE_HOME_URL: JSON.stringify(`https://pl.dev`)
        }),

        new webpack.ProvidePlugin({
          c3: 'c3',
          Bugsnag: 'bugsnag-js'
        })
      ]
    },

    webpackMiddleware: {
      stats: {
        chunks: false,
      },
    },

    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],

    mochaReporter: {
      output: 'autowatch',
      showDiff: 'inline'
    },

    // web server port
    port: 9876,

    // enable colors in the output
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // toggle whether to watch files and rerun tests upon incurring changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          // Without a remote debugging port, Google Chrome exits immediately.
          ' --remote-debugging-port=9222',
        ]
      }
    },


    // if true, Karma runs tests once and exits
    singleRun: true
  });
};
