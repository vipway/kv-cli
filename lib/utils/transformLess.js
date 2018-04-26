'use strict';

const path = require('path');
const { readFileSync } = require('fs');
const less = require('less');
const NpmImportPlugin = require('less-plugin-npm-import');

function transformLess(lessFile, config = {}) {
  const { cwd = process.cwd() } = config;
  const resolvedLessFile = path.resolve(cwd, lessFile);
  let data = readFileSync(resolvedLessFile, 'utf-8');
  data = data.replace(/^\uFEFF/, '');
  const lessOpts = {
    paths: [path.dirname(resolvedLessFile)],
    filename: resolvedLessFile,
    plugins: [new NpmImportPlugin({ prefix: '~' })]
  };
  return less.render(data, lessOpts).then(r => {
    return r.css;
  });
}

module.exports = transformLess;
