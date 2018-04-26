'use strict';

const path = require('path');
const less = require('less');
const gulp = require('gulp');
const through2 = require('through2');
const { readFileSync } = require('fs');
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

function compileLess(source, libDir) {
  return gulp
    .src(source)
    .pipe(
      through2.obj(function(file, encoding, next) {
        this.push(file.clone());
        if (!file.path.match(/\.mixin\.less$/)) {
          transformLess(file.path)
            .then(css => {
              file.contents = Buffer.from(css);
              file.path = file.path.replace(/\.less$/, '.css');
              this.push(file);
              next();
            })
            .catch(e => {
              console.error(e);
            });
        } else {
          next();
        }
      })
    )
    .pipe(gulp.dest(libDir));
}

module.exports = compileLess;
