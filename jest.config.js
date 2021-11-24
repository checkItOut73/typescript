const TESTS_DIRECTORY = 'tests';
const COVERAGE_REPORT_DIRECTORY = '__coverage_report__';
const TSCONFIG_PATH = require.resolve('./tsconfig');

const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require(TSCONFIG_PATH);

module.exports = {
    rootDir: process.cwd(),
    clearMocks: true,
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    globals: {
        'ts-jest': {
            tsconfig: TSCONFIG_PATH
        }
    },
    testRegex: TESTS_DIRECTORY + '/.*\\.test\\.(jsx?|tsx?)$',
    testPathIgnorePatterns: [COVERAGE_REPORT_DIRECTORY, '__mocks__'],
    modulePaths: [process.cwd()],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    collectCoverage: true,
    coverageDirectory: TESTS_DIRECTORY + '/' + COVERAGE_REPORT_DIRECTORY
};
