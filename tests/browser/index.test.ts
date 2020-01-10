describe('index | ', () => {
    const consoleLogBackup = console.log;

    beforeAll(() => {
        console.log = jest.fn();
    });

    afterAll(() => {
        console.log = consoleLogBackup;
    });

    function requireModule() {
        require('../../src/browser/index.ts');
    }

    test('"Hello world!" is logged', () => {
        requireModule();

        expect(console.log).toHaveBeenCalledWith('Hello world!');
    });
});
