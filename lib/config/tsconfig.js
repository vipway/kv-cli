'use strict';

const fs = require('fs');
const path = require('path');
const assign = require('object-assign');

module.exports = function() {
  let tsconfig = {};
  if (fs.existsSync(path.join(process.cwd(), 'tsconfig.json'))) {
    tsconfig = require(path.join(process.cwd(), 'tsconfig.json'));
  }
  return assign(
    {
      target: 'es6',
      jsx: 'preserve',
      module: 'es2015',
      moduleResolution: 'node',
      declaration: true,
      allowSyntheticDefaultImports: true
    },
    tsconfig.compilerOptions
  );
};
