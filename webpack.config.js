const resolve = require('path').resolve
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const url = require('url')
const publicPath = ''

module.exports = (options = {}) => ({
  entry: {
    vendor: './src/vendor',
    index: './src/main.js'
  },
  output: {
    path: resolve(__dirname, 'dist'),
    filename: options.dev ? '[name].js' : '[name].js?[chunkhash]',
    chunkFilename: '[id].js?[chunkhash]',
    publicPath: options.dev ? '/assets/' : publicPath
  },
  module: {
    rules: [{
        test: /\.vue$/,
        use:[{
          loader:'vue-loader',
          options: {
             cssModules: {
                 localIdentName: '[name]-[local]-[hash:base64:5]',
                 camelCase: true
             },
            //  loaders: {
            //       scss: 'style-loader!css-loader!sass-loader',
            //       sass: 'style-loader!css-loader!sass-loader?indentedSyntax',
            //   },
          }
        }]

      },
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: ['style-loader', 'css-loader', 'postcss-loader','sass-loader']
      },
      {
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000
          }
        }]
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      favicon:'src/assets/logo.png',
      inject:true,    //允许插件修改哪些内容，包括head与body
      hash:true
    })
  ],
  externals: [
      {
        'jquery':'window.jQuery',
        'moment':'window.moment'
      }
  ],
  resolve: {
    alias: {//快捷导入别名
      '~': resolve(__dirname, 'src'),
      'components':resolve(__dirname, 'src/assets/components'),
      'globals':resolve(__dirname, 'src/assets/globals'),
      'views':resolve(__dirname, 'src/assets/views'),
      'imgs':resolve(__dirname, 'src/assets/img')
    }
  },
  devServer: {
    host: '127.0.0.1',
    port: 6555,
    proxy: {
      '/api/': {
        target: 'http://127.0.0.1:6555',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    },
    historyApiFallback: {
      index: url.parse(options.dev ? '/assets/' : publicPath).pathname
    }
  },
  devtool: options.dev ? '#eval-source-map' : '#source-map'
})
