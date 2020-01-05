import path from 'path';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackDevConfig from '@configs/webpack.dev.config.js';

const webpackCompiler = webpack(webpackDevConfig);

const server = fastify();

server.register(fastifyStatic, {
    root: path.resolve(process.cwd(), 'dist/browser')
});

if ('development' === process.env.NODE_ENV) {
    server.use(
        webpackDevMiddleware(webpackCompiler, {
            noInfo: true,
            publicPath: new URL(webpackDevConfig.output.publicPath).origin,
            watchOptions: webpackDevConfig.watchOptions,
            writeToDisk: false
        })
    );

    server.use(webpackHotMiddleware(webpackCompiler));
}

const start = async () => {
    try {
        await server.listen(8080, '0.0.0.0');
    } catch (error) {
        server.log.error(error);
    }
};

start();
