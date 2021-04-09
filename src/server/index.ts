import 'module-alias/register';

import path from 'path';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyExpress from 'fastify-express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackDevConfig from '@configs/webpack.dev.config.js';
import WebSocket from 'ws';

const server = fastify();

server.register(fastifyStatic, {
    root: path.resolve(process.cwd(), 'dist/browser')
});

if ('development' === process.env.NODE_ENV) {
    const webpackCompiler = webpack(webpackDevConfig);

    server.register(fastifyExpress).then(() => {
        server.use(
            webpackDevMiddleware(webpackCompiler, {
                publicPath: new URL(webpackDevConfig.output.publicPath).origin,
                writeToDisk: false
            })
        );
    });

    const webSocketServer = new WebSocket.Server({ server: server.server });
    webSocketServer.on('connection', (webSocket) => {
        webpackCompiler.hooks.done.tap('Reloader', () => {
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
