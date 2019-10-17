const TESTS_DIRECTORY = 'tests';
const COVERAGE_REPORT_DIRECTORY = '__coverage_report__';

const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
    rootDir: process.cwd(),
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    testRegex: TESTS_DIRECTORY + '/.*\\.(jsx?|tsx?)$',
    testPathIgnorePatterns: [COVERAGE_REPORT_DIRECTORY],
    modulePaths: [process.cwd()],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    collectCoverage: true,
    coverageDirectory: TESTS_DIRECTORY + '/' + COVERAGE_REPORT_DIRECTORY
};
