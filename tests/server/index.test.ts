import fastifyServerMock from './__mocks__/fastifyServerMock';
import path from 'path';

const fastifyStaticMock = {};
const webpackDevMiddlewareMock = (webpackCompiler, options) => ({
    middleware: 'webpack-dev-middleware',
    webpackCompiler,
    options
});
const webpackHotMiddlewareMock = (webpackCompiler) => ({
    middleware: 'webpack-hot-middleware',
    webpackCompiler
});
const webpackDevConfig = {
    output: {
        publicPath: 'http://localhost/public'
    },
    watchOptions: 'watchOptions'
};

const moduleAliasRegisterSpy = jest.fn();

jest.mock('fastify', () => () => fastifyServerMock);
jest.mock('fastify-static', () => fastifyStaticMock);
jest.mock('webpack', () => (webpackConfig) => webpackConfig);
jest.mock('webpack-dev-middleware', () => webpackDevMiddlewareMock);
jest.mock('webpack-hot-middleware', () => webpackHotMiddlewareMock);
jest.mock('@configs/webpack.dev.config.js', () => webpackDevConfig);
jest.mock('module-alias/register', () => moduleAliasRegisterSpy());

describe('index | ', () => {
    function requireModule() {
        require('@server/index.ts');
    }

    afterEach(() => {
        jest.resetModules();
    });

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

    describe('listen | ', () => {
        test('the server listens', () => {
            requireModule();

            expect(fastifyServerMock.listen).toHaveBeenCalledWith(8080, '0.0.0.0');
        });

        describe('if listen resolves ', () => {
            beforeEach(() => {
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

    describe('middleware | ', () => {
        describe('if the server is started in production mode', () => {
            beforeEach(() => {
                process.env.NODE_ENV = 'production';
            });

            test('no middleware is used', () => {
                requireModule();

                expect(fastifyServerMock.use).not.toHaveBeenCalled();
            });
        });

        describe('if the server is started in development mode', () => {
            beforeEach(() => {
                process.env.NODE_ENV = 'development';
            });

            test('the webpack-dev-middleware is used correctly', () => {
                requireModule();

                expect(fastifyServerMock.use).toHaveBeenCalledWith(
                    {
                        middleware: 'webpack-dev-middleware',
                        webpackCompiler: webpackDevConfig,
                        options: {
                            noInfo: true,
                            publicPath: 'http://localhost',
                            watchOptions: 'watchOptions',
                            writeToDisk: false
                        }
                    }
                );
            });

            test('the webpack-hot-middleware is used correctly', () => {
                requireModule();

                expect(fastifyServerMock.use).toHaveBeenCalledWith(
                    {
                        middleware: 'webpack-hot-middleware',
                        webpackCompiler: webpackDevConfig
                    }
                );
            });
        });
    });
});
