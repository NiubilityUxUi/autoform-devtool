var path = require('path')
var webpack = require('webpack')
// var alias = require('../alias')

const ExtractTextPlugin = require('extract-text-webpack-plugin')

const HtmlWebpackPlugin = require('html-webpack-plugin')

var bubleOptions = {
  target: process.env.NODE_ENV === 'production' ? null : {
    chrome: 52,
    firefox: 48
  },
  objectAssign: 'Object.assign'
}

module.exports = {
  entry: {
    hook: './shells/src/hook.js',
    devtools: './shells/src/devtools.js',
    background: './shells/src/background.js',
    // 'devtools-background': './src/devtools-background.js',
    // backend: './src/backend.js',
    // proxy: './src/proxy.js',
    // detector: './src/detector.js'
  },
  output: {
    path: path.join(__dirname, './shells/dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue'],
    // alias
  },
  module: {
    rules: [{
        test: /\.js$/,
        loader: 'buble-loader',
        exclude: /node_modules|vue\/dist|vuex\/dist/,
        options: bubleOptions
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          preserveWhitespace: false,
          buble: bubleOptions,
          loaders: {
            css: ExtractTextPlugin.extract({
              use: 'css-loader',
              fallback: 'vue-style-loader' // <- this is a dep of vue-loader, so no need to explicitly install if using npm3
            })
          }
        },
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader')
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/i,
        use: [{
            loader: 'url-loader',
            query: {
                limit: 10000
            }
        }]
    },
    ]
  },
  performance: {
    hints: false
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'commons',
    //   filename: '[name].[chunkhash].js',
    // }),
    new HtmlWebpackPlugin({
      filename: '../devtools.html',
      template: './devtools.html',
      chunks: ['devtools']
    }),
    new ExtractTextPlugin({
      filename: '[name].[contenthash:16].css',
      allChunks: true
    }),

  ],
  devtool: process.env.NODE_ENV !== 'production' ?
    '#inline-source-map' : false
}

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins = [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    })
  ]
}