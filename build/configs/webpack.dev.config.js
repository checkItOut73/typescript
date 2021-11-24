const webpack = require('webpack');
const webpackConfig = require('./webpack.config');
const mergeOptions = require('merge-options');

const config = {
    entry: ['webpack-hot-middleware/client'],
    output: {
        publicPath: 'http://docker-vm:8080/',
        hotUpdateChunkFilename: 'hot_update/[id].[fullhash].hot-update.js',
        hotUpdateMainFilename: 'hot_update/[fullhash].hot-update.json'
    },
    resolve: {
        alias: {
            'react-dom': '@hot-loader/react-dom'
        }
    },
    mode: 'development',
    devtool: 'eval-source-map',
    watchOptions: {
        poll: 500
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};

module.exports = mergeOptions.call({ concatArrays: true }, webpackConfig, config);
