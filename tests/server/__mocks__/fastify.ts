const fastifyServerMock = {
    then: jest.fn(),
    register: jest.fn(() => fastifyServerMock),
    listen: jest.fn(),
    use: jest.fn(),
    log: {
        error: jest.fn()
    }
};

export default () => fastifyServerMock;
