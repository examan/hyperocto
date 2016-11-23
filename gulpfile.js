'use strict'

let gulp = require('gulp')
var merge = require('merge-stream')
let eslint = require('gulp-eslint')
let babel = require("gulp-babel");
let zip = require('gulp-zip');

gulp.task('default', function () {
  let pkg = require('./package.json')

  return merge(

    gulp.src(['src/**/*.js', '!src/lib/browser-polyfill.js'])
      .pipe(eslint())
      .pipe(eslint.formatEach())
      .pipe(eslint.failAfterError())
      .pipe(babel({
        'comments': false,
        'presets': ['babili']
      })),

    gulp.src(['src/**/*', '!src/**/*.js', 'src/lib/browser-polyfill.js'])

  ).pipe(zip('hyperocto.zip'))
  .pipe(gulp.dest('dest'))
})
