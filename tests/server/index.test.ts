import path from 'path';
import fastify from 'fastify';
import webpack from 'webpack';
import WebSocket from 'ws';

const moduleAliasRegisterSpy = jest.fn();
const fastifyServerMock = fastify();
const fastifyStaticMock = {};
const webpackDevMiddlewareMock = (webpackCompiler, options) => ({
    middleware: 'webpack-dev-middleware',
    webpackCompiler,
    options
});
const webpackDevConfig = {
    output: {
        publicPath: 'http://localhost/public'
    },
    watchOptions: 'watchOptions'
};
const webpackCompiler = webpack();
const webSocketServer = WebSocket.Server();

jest.mock('module-alias/register', () => moduleAliasRegisterSpy());
jest.mock('fastify');
jest.mock('fastify-static', () => fastifyStaticMock);
jest.mock('webpack');
jest.mock('webpack-dev-middleware', () => webpackDevMiddlewareMock);
jest.mock('@configs/webpack.dev.config.js', () => webpackDevConfig);
jest.mock('ws');

describe('index | ', () => {
    function requireModule() {
        jest.isolateModules(() => {
            require('@server/index.ts');
        });
    }

    test('module-alias/register is loaded', () => {
        requireModule();

        expect(moduleAliasRegisterSpy).toHaveBeenCalled();
    });

    test('fastifyStatic is registered on the server', () => {
        requireModule();

        expect(fastifyServerMock.register).toHaveBeenCalledWith(
            fastifyStaticMock,
            { root: path.resolve(process.cwd(), 'dist/browser') }
        );
    });

    describe('development | ', () => {
        describe('if the server is started in development mode', () => {
            beforeEach(() => {
                process.env.NODE_ENV = 'development';
            });

            test('the webpack compiler is initialized with the webpackDevConfig', () => {
                requireModule();

                expect(webpack).toHaveBeenCalledWith(webpackDevConfig);
            });

            test('the webpack-dev-middleware is used correctly', () => {
                requireModule();

                expect(fastifyServerMock.use).toHaveBeenCalledWith(
                    {
                        middleware: 'webpack-dev-middleware',
                        webpackCompiler,
                        options: {
                            noInfo: true,
                            publicPath: 'http://localhost',
                            watchOptions: 'watchOptions',
                            writeToDisk: false
                        }
                    }
                );
            });

            test('the web socket server is started correctly', () => {
                requireModule();

                expect(WebSocket.Server).toHaveBeenCalledWith({ server: 'server' });
            });

            describe('when there is a new web socket connection', () => {
                const webSocket = { send: jest.fn() };

                beforeEach(() => {
                    webSocketServer.emit('connection', webSocket);
                });

                test(
                    'a message is sent via this web socket ' +
                    'when the webpack compilation is done',
                    () => {
                        expect(webSocket.send).not.toHaveBeenCalled();

                        webpackCompiler.emit('done');

                        expect(webSocket.send).toHaveBeenCalledWith('compilationDone');
                    }
                );
            });
        });

        describe('if the server is started in production mode', () => {
            beforeEach(() => {
                process.env.NODE_ENV = 'production';
            });

            test('the webpack compiler is not initialized', () => {
                requireModule();

                expect(webpack).not.toHaveBeenCalled();
            });

            test('no middleware is used', () => {
                requireModule();

                expect(fastifyServerMock.use).not.toHaveBeenCalled();
            });

            test('the web socket server is not started', () => {
                requireModule();

                expect(WebSocket.Server).not.toHaveBeenCalled();
            });
        });
    });

    describe('listen | ', () => {
        test('the server listens', () => {
            requireModule();

            expect(fastifyServerMock.listen).toHaveBeenCalledWith(8080, '0.0.0.0');
        });

        describe('if listen resolves ', () => {
            beforeEach(() => {
                // @ts-ignore
                fastifyServerMock.listen.mockReturnValue(Promise.resolve());
            });

            test('no error is logged', () => {
                requireModule();

                expect(fastifyServerMock.log.error).not.toHaveBeenCalled();
            });
        });

        describe('if listen causes an error ', () => {
            const error = new Error('listen error');

            beforeEach(() => {
                // @ts-ignore
                fastifyServerMock.listen.mockReturnValue(Promise.reject(error));
            });

            test('this error is logged', (done) => {
                requireModule();

                setImmediate(() => {
                    expect(fastifyServerMock.log.error).toHaveBeenCalledWith(error);
                    done();
                });
            });
        });
    });
});
