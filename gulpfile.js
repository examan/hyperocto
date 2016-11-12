'use strict'

let gulp = require('gulp')
let eslint = require('gulp-eslint')
let zip = require('gulp-zip');

gulp.task('default', function () {
  gulp.src('src/*.js')
    .pipe(eslint())
    .pipe(eslint.formatEach())
    .pipe(eslint.failAfterError());

  gulp.src('src/**/*')
    .pipe(zip('hyperocto.zip'))
    .pipe(gulp.dest('dest'))
})
