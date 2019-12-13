const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const TSCONFIG_PATH = path.resolve(__dirname, 'tsconfig.json');
const { compilerOptions } = require(TSCONFIG_PATH);

module.exports = {
    entry: ['./src/browser/index.tsx'],
    output: {
        path: path.resolve(process.cwd(), 'dist/browser'),
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js', '.jsx'],
        alias: compilerOptionsToResolveAliasMapper(compilerOptions)
    },
    mode: 'production',
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
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/browser/index.html',
            filename: 'index.html'
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
