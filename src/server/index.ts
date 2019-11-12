import path from 'path';
import MemoryFileSystem from 'memory-fs';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../../build/configs/webpack.config.js';

const memoryFileSystem = new MemoryFileSystem();
const webpackCompiler = webpack(webpackConfig);

const server = fastify();

server.register(fastifyStatic, {
    root: path.resolve(process.cwd(), 'dist/browser')
});

server.get('/', async (request, reply) => {
    reply.send(memoryFileSystem.readFileSync('templates/index.html'));
});

server.use(
    webpackDevMiddleware(webpackCompiler, {
        noInfo: true,
        publicPath: webpackConfig.output.publicPath,
        watchOptions: webpackConfig.watchOptions,
        fs: memoryFileSystem
    })
);

server.use(webpackHotMiddleware(webpackCompiler));

const start = async () => {
    try {
        await server.listen(8080, '0.0.0.0');
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
