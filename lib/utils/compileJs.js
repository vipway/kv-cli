'use strict';

const gulp = require('gulp');
const babel = require('gulp-babel');
const through2 = require('through2');
const babelConfig = require('../config/babelConfig')();

function compileJs(commandName, js, libDir) {
  const flag = !!(commandName === 'compile-kv-design');
  if (flag) {
    babelConfig.plugins.push([
      require.resolve('babel-plugin-kv-import'),
      {
        libraryName: 'kv-ui-core',
        libraryDirectory: 'lib/service',
        deleteImportNameContent: 'Service',
        style: false
      }
    ]);
  }
  let stream = js.pipe(babel(babelConfig)).pipe(
    through2.obj(function(file, encoding, next) {
      this.push(file.clone());
      if (flag) {
        if (file.path.match(/index\.js/)) {
          const content = file.contents.toString(encoding);
          file.contents = Buffer.from(content.replace(/\.less/g, '.css'));
          this.push(file);
          next();
        } else {
          next();
        }
      } else {
        next();
      }
    })
  );
  return stream.pipe(gulp.dest(libDir));
}

module.exports = compileJs;
