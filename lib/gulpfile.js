'use strict';

const path = require('path');
const rimraf = require('rimraf');
const chalk = require('chalk');
const gulp = require('gulp');
const merge2 = require('merge2');
const libDir = path.join(process.cwd(), 'lib');
const lessSource = ['src/**/*.less'];
const tsSource = ['src/**/*.tsx', 'src/**/*.ts', 'typings/**/*.d.ts'];
const assetSource = ['src/**/*.@(png|jpg|jepg|svg|gif|eot|woff)'];
const compileTs = require('./utils/compileTs');
const compileJs = require('./utils/compileJs');
const compileLess = require('./utils/compileLess');

gulp.task('compile', () => {
  console.log(chalk.green('compile start...'));
  rimraf.sync(libDir);
  const tsResult = compileTs(tsSource);
  const tsFilesStream = compileJs('compile', tsResult.js, libDir);
  const tsd = tsResult.dts.pipe(gulp.dest(libDir));
  const assets = gulp.src(assetSource).pipe(gulp.dest(libDir));
  return merge2([tsFilesStream, tsd, assets]);
});

gulp.task('compile-kv-design', () => {
  console.log(chalk.green('compile-kv-design start...'));
  rimraf.sync(libDir);
  const tsResult = compileTs(tsSource);
  const tsFilesStream = compileJs('compile-kv-design', tsResult.js, libDir);
  const tsd = tsResult.dts.pipe(gulp.dest(libDir));
  const assets = gulp.src(assetSource).pipe(gulp.dest(libDir));
  const less = compileLess(lessSource, libDir);
  return merge2([tsFilesStream, tsd, assets, less]);
});
