var path    = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {},
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
      { test: /\.js$/, loader: 'eslint', exclude: [/app\/lib/, /node_modules/] }
    ],
    loaders: [
      { test: /\.js$/, exclude: [/app\/lib/, /node_modules/], loader: 'ng-annotate?add=true&single_quotes=true!babel' },
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
    ]
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./client/app")]
  },
  eslint: {
    failOnWarning: false,
    failOnError: true
  },
  plugins: [
    // Automatically move all modules defined outside of application directory to vendor bundle.
    // If you are using more complicated project structure, consider to specify common chunks manually.
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function (module, count) {
        return module.resource && module.resource.indexOf(path.resolve(__dirname, 'client')) === -1;
      }
    }),

    new webpack.ProvidePlugin({
      c3: 'c3'
    })
  ]
};
