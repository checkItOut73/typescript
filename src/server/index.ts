import 'module-alias/register';

import path from 'path';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackDevConfig from '@configs/webpack.dev.config.js';
import WebSocket from 'ws';

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

    const webSocketServer = new WebSocket.Server({ server: server.server });
    webSocketServer.on('connection', (webSocket) => {
        webpackCompiler.plugin('done', () => {
           webSocket.send('compilationDone');
        });
    });
}

const start = async () => {
    try {
        await server.listen(8080, '0.0.0.0');
    } catch (err) {
        server.log.error(err);
    }
};

start();
