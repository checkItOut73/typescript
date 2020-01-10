import {EventEmitter} from 'events';

const serverEventEmitter = new EventEmitter();

const webSocketServer = {
    on: serverEventEmitter.on,
    emit: serverEventEmitter.emit,
    send: jest.fn()
};

export default {
    Server: jest.fn(function () {
        return webSocketServer;
    })
};
