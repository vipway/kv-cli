'use strict';

const path = require('path');
const less = require('less');
const gulp = require('gulp');
const through2 = require('through2');
const fs = require('fs');
const NpmImportPlugin = require('less-plugin-npm-import');

function transformLess(lessFile, config = {}) {
  const { cwd = process.cwd() } = config;
  const resolvedLessFile = path.resolve(cwd, lessFile);
  let data = fs.readFileSync(resolvedLessFile, 'utf-8');
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

function createEntryLess() {
  if (fs.existsSync(path.join(process.cwd(), 'lib'))) {
    const componentsPath = path.join(process.cwd(), 'src', 'components');
    let componentsLessContent = '';
    fs.readdir(componentsPath, function (err, files) {
      files.forEach(function (file) {
        if (fs.existsSync(path.join(componentsPath, file, `${file}.less`))) {
          componentsLessContent += `@import "../components/${file}/${file}.less";\n`
        }
      });
      fs.writeFileSync(path.join(process.cwd(), 'lib', 'styles', 'components.less'), componentsLessContent);
      fs.writeFileSync(path.join(process.cwd(), 'index.less'), '@import "./lib/styles/kv.less";\n@import "./lib/styles/components.less";');
    });
  }
}

function compileLess(source, libDir) {
  return gulp
    .src(source)
    .pipe(
      through2.obj(function (file, encoding, next) {
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
    .pipe(gulp.dest(libDir))
    .on('finish', createEntryLess)
}

module.exports = compileLess;
