'use strict';

const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsConfig = require('../config/tsconfig')();
const tsDefaultReporter = ts.reporter.defaultReporter();

function compileTs(source) {
  let error = false;
  const tsResult = gulp.src(source).pipe(
    ts(tsConfig, {
      error(e) {
        tsDefaultReporter.error(e);
        error = true;
      },
      finish: tsDefaultReporter.finish
    })
  );
  function check() {
    if (error && !argv['ignore-error']) {
      process.exit(1);
    }
  }
  tsResult.on('finish', check);
  tsResult.on('end', check);
  return tsResult;
}

module.exports = compileTs;
