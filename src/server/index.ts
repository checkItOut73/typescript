import 'module-alias/register';

import path from 'path';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddlewareFlushProxy from './webpackHotMiddlewareFlushProxy';
import webpackDevConfig from '@configs/webpack.dev.config.js';

(async function () {
    const server = fastify();

    server.register(fastifyStatic, {
        root: path.resolve(process.cwd(), 'dist/browser')
    });

    if ('development' === process.env.NODE_ENV) {
        const webpackCompiler = webpack(webpackDevConfig);

        await server.register(require('middie'));

        // @ts-ignore
        server.use(
            webpackDevMiddleware(webpackCompiler, {
                publicPath: new URL(webpackDevConfig.output.publicPath).origin,
                writeToDisk: false
            })
        );

        // @ts-ignore
        server.use(webpackHotMiddlewareFlushProxy(webpackCompiler));
    }

    try {
        await server.listen(8080, '0.0.0.0');
    } catch (error) {
        server.log.error(error);
    }
})();
