const fastifyServerMock = {
    register: jest.fn(),
    listen: jest.fn(),
    use: jest.fn(),
    log: {
        error: jest.fn()
    },
    server: 'server'
};

export default () => fastifyServerMock;
