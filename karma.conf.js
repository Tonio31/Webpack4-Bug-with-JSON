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
      { pattern: './node_modules/phantomjs-polyfill-string-includes/index.js', watched: false },
      { pattern: 'spec.bundle.js', watched: false }
    ],

    // files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: { 'spec.bundle.js': ['webpack', 'sourcemap'] },

    webpack: {
      devtool: 'inline-source-map',
      resolve: {
        root: path.resolve(__dirname),
        extensions: ['', '.js'],
        alias: {
          app: 'client/app',
          common: 'client/app/common',
          components: 'client/app/components'
        }
      },
      module: {
        preLoaders: [
          { test: /\.js$/, loader: 'eslint?{ configFile: ".eslintrc.spec.js" }', exclude: [/app\/lib/, /node_modules/] }
        ],
        loaders: [
          { test: /\.js/, exclude: [/app\/lib/, /node_modules/], loader: 'babel' },
          { test: /\.html$/, loader: 'raw' },
          { test: /\.(scss|sass)$/, loader: 'style!css!sass' },
          { test: /\.css$/, loader: 'style!css' },
          { test: /\.svg/, loader: 'svg-url-loader' },
          { test: /\.json$/, loader: 'json-loader' },
          { test: /\.(png|jpg)$/, loader: 'url-loader?limit=1024' },
          { test: /\.woff$/, loader: 'url?limit=65000&mimetype=application/font-woff&name=public/fonts/[name].[ext]' },
          { test: /\.woff2$/, loader: 'url?limit=65000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]' },
          { test: /\.[ot]tf$/, loader: 'url?limit=65000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]' },
          { test: /\.eot$/, loader: 'url?limit=65000&mimetype=application/vnd.ms-fontobject&name=public/fonts/[name].[ext]' }
        ],
        noParse: [
          '/node_modules/d3-cloud/build/d3.layout.cloud.js',
        ]
      },
      sassLoader: {
        includePaths: [path.resolve(__dirname, "./client/app")]
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

    // if true, Karma runs tests once and exits
    singleRun: true
  });
};
