'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

const { VueLoaderPlugin } = require('vue-loader')

// Merge webpack configuration files
const config = merge(common, {
  entry: {
    main: PATHS.src + '/main.js',
    background: PATHS.src + '/background.js',
  },
  module: {
    rules: [
      { test: /\.vue$/, use: ['vue-loader'] },
      { test: /\.s[ca]ss$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      { test: /\.(png|jpe?g|gif|svg|webp)$/, type: 'asset/resource' },
    ],
  },
  plugins: [new VueLoaderPlugin()]
});

module.exports = config;
