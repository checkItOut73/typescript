import fastify from 'fastify';
import path from 'path';
import webpack from 'webpack';
import { FastifyInstanceWithUse } from '@server/types/FastifyInstaceWithUse';
import { Mock } from '@tests/__types__/Mock';

const moduleAliasRegisterSpy = jest.fn();
const fastifyServerMock: Mock<
    FastifyInstanceWithUse & { then: (cb: Function) => void }
> = fastify();

const fastifyStaticMock = {};
const middieMock = {};
const webpackCompiler = webpack({});
const webpackDevMiddlewareMock = (webpackCompiler, options) => ({
    middleware: 'webpack-dev-middleware',
    webpackCompiler,
    options
});
const webpackHotMiddlewareFlushProxyMock = (webpackCompiler) => ({
    middleware: 'webpackHotMiddlewareFlushProxyMock',
    webpackCompiler
});
const webpackDevConfig = {
    output: {
        publicPath: 'http://localhost/public'
    },
    watchOptions: 'watchOptions'
};

jest.mock('fastify');
jest.mock('fastify-static', () => fastifyStaticMock);
jest.mock('middie', () => middieMock);
jest.mock('webpack');
jest.mock('webpack-dev-middleware', () => webpackDevMiddlewareMock);
jest.mock(
    '@server/webpackHotMiddlewareFlushProxy',
    () => webpackHotMiddlewareFlushProxyMock
);
jest.mock('@configs/webpack.dev.config.js', () => webpackDevConfig);
jest.mock('module-alias/register', () => moduleAliasRegisterSpy());

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

            test('middie is registered on the server', () => {
                requireModule();

                expect(fastifyServerMock.register).toHaveBeenCalledWith(
                    middieMock
                );
            });

            describe('after middie registration has resolved', () => {
                beforeEach(async () => {
                    requireModule();
                    await Promise.resolve(true);

                    fastifyServerMock.then.mock.calls[0][0]();
                });

                test('the webpack-dev-middleware is used correctly', () => {
                    expect(fastifyServerMock.use).toHaveBeenCalledWith({
                        middleware: 'webpack-dev-middleware',
                        webpackCompiler,
                        options: {
                            publicPath: 'http://localhost',
                            writeToDisk: false
                        }
                    });
                });

                test('the webpackHotMiddlewareFlushProxyMock is used correctly', () => {
                    expect(fastifyServerMock.use).toHaveBeenCalledWith({
                        middleware: 'webpackHotMiddlewareFlushProxyMock',
                        webpackCompiler
                    });
                });
            });
        });

        describe('if the server is started in production mode', () => {
            beforeEach(async () => {
                process.env.NODE_ENV = 'production';
            });

            test('middie is not registered on the server', () => {
                requireModule();

                expect(fastifyServerMock.register).not.toHaveBeenCalledWith(
                    middieMock
                );
            });

            test('the webpack compiler is not initialized', () => {
                requireModule();

                expect(webpack).not.toHaveBeenCalled();
            });

            test('no middleware is used', () => {
                requireModule();

                expect(fastifyServerMock.use).not.toHaveBeenCalled();
            });
        });
    });

    describe('listen | ', () => {
        test('the server listens', () => {
            requireModule();

            expect(fastifyServerMock.listen).toHaveBeenCalledWith(
                8080,
                '0.0.0.0'
            );
        });

        describe('if listen resolves ', () => {
            beforeEach(() => {
                fastifyServerMock.listen.mockReturnValue(Promise.resolve(''));
            });

            test('no error is logged', () => {
                requireModule();

                expect(fastifyServerMock.log.error).not.toHaveBeenCalled();
            });
        });

        describe('if listen causes an error ', () => {
            const error = new Error('listen error');

            beforeEach(() => {
                fastifyServerMock.listen.mockReturnValue(Promise.reject(error));
            });

            test('this error is logged', (done) => {
                requireModule();

                setImmediate(() => {
                    expect(fastifyServerMock.log.error).toHaveBeenCalledWith(
                        error
                    );
                    done();
                });
            });
        });
    });
});
