const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const TSCONFIG_PATH = path.resolve(__dirname, 'tsconfig.json');
const { compilerOptions } = require(TSCONFIG_PATH);

module.exports = {
    entry: ['webpack-hot-middleware/client', './src/browser/index.tsx'],
    output: {
        path: path.resolve(process.cwd(), 'dist/browser'),
        publicPath: 'http://docker-vm:8080/',
        filename: 'bundle.js',
        hotUpdateChunkFilename: 'hot_update/[id].[hash].hot-update.js',
        hotUpdateMainFilename: 'hot_update/[hash].hot-update.json'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            ...compilerOptionsToResolveAliasMapper(compilerOptions)
        }
    },
    mode: 'development',
    devtool: 'eval-source-map',
    watchOptions: {
        poll: 500
    },
    module: {
        rules: [
            {
                test: /\.(j|t)s(x)?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        babelrc: false,
                        presets: [
                            [
                                '@babel/preset-env',
                                { targets: { browsers: 'last 2 versions' } }
                            ],
                            '@babel/preset-typescript',
                            '@babel/preset-react'
                        ],
                        plugins: [
                            [
                                '@babel/plugin-proposal-decorators',
                                { legacy: true }
                            ],
                            [
                                '@babel/plugin-proposal-class-properties',
                                { loose: true }
                            ],
                            'react-hot-loader/babel'
                        ]
                    }
                }
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({
            tsconfig: TSCONFIG_PATH
        }),
        new HtmlWebpackPlugin({
            title: 'Editor',
            template: 'src/browser/templates/index.html',
            filename: 'templates/index.html'
        })
    ]
};

/**
 * @param {string} baseUrl
 * @param {Object} paths
 * @return {Object}
 */
function compilerOptionsToResolveAliasMapper({ baseUrl, paths }) {
    const rootDir = path.resolve(path.dirname(TSCONFIG_PATH), baseUrl);

    let resolveAlias = {};
    Object.entries(paths).forEach(([shortcut, paths]) => {
        const alias = shortcut.replace(/\/\*$/, '');
        const pathFromRoot = paths[0].replace(/\/\*$/, '');

        resolveAlias[alias] = path.resolve(rootDir, pathFromRoot);
    });

    return resolveAlias;
}
