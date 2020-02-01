const jasmine2 = require('jest-jasmine2');
const path = require('path');
const fs = require('fs');

const SOURCE_DIRECTORY = 'src';
const TESTS_DIRECTORY = 'tests';
const MOCKS_DIRECTORY = '__mocks__';

module.exports = function(globalConfig, config, environment, runtime, testPath) {
    interceptMethodReturnValue(environment, 'runScript', (runScript) => {
        interceptMethodArguments(runScript, Object.keys(runScript)[0], function () {
            const jestObject = arguments[6];

            interceptMethodArguments(jestObject, 'mock', (moduleName, mockFactory, options) => {
                if (!mockFactory) {
                    const potentialMockPath = getPotentialMockPath(moduleName);

                    if (potentialMockPath && fs.existsSync(potentialMockPath)) {
                        mockFactory = () => runtime.requireModule(potentialMockPath);
                    }
                }

                return [ moduleName, mockFactory, options ];
            });
        });
    });

    /**
     * @param {string} moduleName
     * @returns {string}
     */
    function getPotentialMockPath(moduleName) {
        const modulePath = runtime._resolver.resolveStubModuleName(testPath, moduleName);

        if (modulePath && modulePath.replace(/\\/g, '/').includes(`/${SOURCE_DIRECTORY}/`)) {
            return path.join(
                path.dirname(modulePath).replace(/\\/g, '/').replace(`/${SOURCE_DIRECTORY}/`, `/${TESTS_DIRECTORY}/`),
                MOCKS_DIRECTORY,
                path.basename(modulePath)
            );
        }
    }

    return jasmine2(...arguments);
};

function interceptMethodArguments(object, methodName, argumentsCallback) {
    interceptMethod(object, methodName, { argumentsCallback });
}

function interceptMethodReturnValue(object, methodName, returnValueCallback) {
    interceptMethod(object, methodName, { returnValueCallback });
}

function interceptMethod(object, methodName, { argumentsCallback, returnValueCallback }) {
    const originalMethod = object[methodName].bind(object);

    object[methodName] = function () {
        let _arguments = arguments;

        if (argumentsCallback) {
            const resultArguments = argumentsCallback(..._arguments);

            if (resultArguments) {
                _arguments = resultArguments;
            }
        }

        const returnValue = originalMethod(..._arguments);

        if (returnValueCallback) {
            returnValueCallback(returnValue);
        }

        return returnValue;
    }
}
