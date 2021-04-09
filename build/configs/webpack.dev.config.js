const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const mergeOptions = require('merge-options');

const config = {
    entry: ['./build/configs/webpack.dev.browser.reloading'],
    output: {
        publicPath: 'http://docker-vm:8080/'
    },
    mode: 'development',
    devtool: 'eval-source-map',
    watchOptions: {
        poll: 500
    }
};

module.exports = mergeOptions.call(
    { concatArrays: true },
    webpackConfig,
    config
);
