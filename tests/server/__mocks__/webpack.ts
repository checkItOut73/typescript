import {EventEmitter} from 'events';

const webpackCompilerEventEmitter = new EventEmitter();

const webpackCompiler = {
    plugin: webpackCompilerEventEmitter.on,
    emit: webpackCompilerEventEmitter.emit
};

export default jest.fn((webpackConfig) => webpackCompiler);
