const TESTS_DIRECTORY = 'tests';
const COVERAGE_REPORT_DIRECTORY = '__coverage_report__';
const TSCONFIG_PATH = require.resolve('./tsconfig');
const JEST_PRETTIER_PATH = require.resolve('./jest.prettier.js');

const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require(TSCONFIG_PATH);

module.exports = {
    rootDir: process.cwd(),
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    globals: {
        'ts-jest': {
            tsConfig: TSCONFIG_PATH
        }
    },
    prettierPath: JEST_PRETTIER_PATH,
    testRegex: TESTS_DIRECTORY + '/.*\\.(jsx?|tsx?)$',
    testPathIgnorePatterns: [COVERAGE_REPORT_DIRECTORY, '__mocks__'],
    modulePaths: [process.cwd()],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    collectCoverage: true,
    coverageDirectory: TESTS_DIRECTORY + '/' + COVERAGE_REPORT_DIRECTORY
};
