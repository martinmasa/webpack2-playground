const HTMLWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const isProd = process.env.NODE_ENV === 'production';

const path = require('path');

let cssConfig = ['style-loader', 'css-loader', 'sass-loader'];

if (isProd) {
  cssConfig = ExtractTextWebpackPlugin.extract({
    use: ['css-loader', 'sass-loader'],
    fallback: 'style-loader',
    publicPath: '/dist'
  });
}

const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;


module.exports = {
  entry: {
    app: './src/app.js',
    contact: './src/contact.js',
    bootstrap: bootstrapConfig
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      { 
        test: /\.scss$/, 
        use: cssConfig
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.pug$/,
        use: ['html-loader', 'pug-html-loader']
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          'file-loader?name=images/[name].[ext]',  
          // 'file-loader?name=[name].[ext]&outputPath=images/',  // didn't have to specify &publicPath=images/
          'image-webpack-loader'
        ]
      },
      { 
        test: /\.(woff2?|svg)$/, 
        use: 'url-loader?limit=10000&name=fonts/[name].[ext]' 
      },
      { 
        test: /\.(ttf|eot)$/, 
        use: 'file-loader?name=fonts/[name].[ext]' 
      },
      { 
        test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/, 
        use: 'imports-loader?jQuery=jquery' 
      },
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    stats: 'errors-only'
    // open: true
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: 'Webpack demo',
      minify: {
        collapseWhitespace: true
      },
      hash: true,
      excludeChunks: ['contact'],
      template: './src/index.ejs' // Load a custom template (ejs by default see the FAQ for details)
    }),
    new HTMLWebpackPlugin({
      title: 'Contact page',
      minify: {
        collapseWhitespace: true
      },
      hash: true,
      chunks: ['contact'],
      filename: 'contact.html',
      template: './src/contact.ejs' // Load a custom template (ejs by default see the FAQ for details)
    }),
    new HTMLWebpackPlugin({
      title: 'Bootstrap',
      minify: {
        collapseWhitespace: true
      },
      hash: true,
      excludeChunks: ['contact'],
      filename: 'bootstrap.html',
      template: './src/bootstrap.html' // Load a custom template (ejs by default see the FAQ for details)
    }),
    new HTMLWebpackPlugin({
      title: 'Pug Home',
      minify: {
        collapseWhitespace: true
      },
      hash: true,
      filename: 'pug/index.html',
      template: './src/pug/index.pug' // Load a custom template (ejs by default see the FAQ for details)
    }),
    new ExtractTextWebpackPlugin({
      filename: 'css/[name].css',
      allChunks: true,
      disable: !isProd
    }),
    new webpack.HotModuleReplacementPlugin(),
    new PurifyCSSPlugin({
      // Give paths to parse for rules. These should be absolute!
      paths: glob.sync(path.join(__dirname, 'src/*.html')),
    })
  ]
};