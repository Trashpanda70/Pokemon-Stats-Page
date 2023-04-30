const fs = require('fs');

module.exports = async (globalConfig, projectConfig) => {
  fs.unlinkSync(globalThis.__FILE__);
};