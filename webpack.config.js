const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: {
    path: `${__dirname}/dist`,
    filename: 'app.bundle.js'
  },
  module: {
    rules: [
      { 
        test: /\.scss$/, 
        use: ExtractTextWebpackPlugin.extract({
          use: ['css-loader', 'sass-loader'],
          fallback: 'style-loader',
          publicPath: '/dist'
        })
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Webpack demo',
      minify: {
        collapseWhitespace: true
      },
      hash: true,
      template: './src/index.ejs' // Load a custom template (ejs by default see the FAQ for details)
    }),
    new ExtractTextWebpackPlugin({
      filename: 'app.css',
      allChunks: true,
      disable: false
    })
  ]
};