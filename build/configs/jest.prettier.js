const prettier = require('prettier');

const PRETTIER_CONFIG_PATH = __dirname;

const originalResolveConfigSync = prettier.resolveConfig.sync;

prettier.resolveConfig.sync = function (filePath, opts) {
  return originalResolveConfigSync(PRETTIER_CONFIG_PATH, opts);
};

module.exports = prettier;
