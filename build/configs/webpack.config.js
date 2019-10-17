const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const TSCONFIG_PATH = path.resolve(__dirname, 'tsconfig.json');
const { compilerOptions } = require(TSCONFIG_PATH);

module.exports = {
    entry: './src/browser/index.tsx',
    mode: 'development',
    devServer: {
        host: '0.0.0.0',
        port: 8080,
        disableHostCheck: true,
        stats: {
            children: false,
            maxModules: 0
        }
    },
    watchOptions: {
        poll: 1000
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: TSCONFIG_PATH
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: compilerOptionsToResolveAliasMapper(compilerOptions)
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(process.cwd(), 'dist/browser')
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Editor',
            template: 'src/browser/index.html'
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
