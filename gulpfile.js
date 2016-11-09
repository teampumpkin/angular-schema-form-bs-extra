/* jshint node:true */
'use strict';


var gulp = require('gulp');
var fs = require('fs');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifyHTML = require('gulp-minify-html');
// var streamqueue = require('streamqueue');

gulp.task('default', ['templateCache', 'minify' ]);

gulp.task('templateCache', function () {
  return gulp.src('src/templates/**/*.html')
    .pipe(minifyHTML({
      quotes: true
    }))
    .pipe(templateCache({
      standalone: true,
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('minify', function () {
  var files = [
    'src/*.js'
  ];

  return gulp.src(files)
    .pipe(concat('angular-schema-form-bs-extra.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename('angular-schema-form-bs-extra.min.js'))
    .pipe(gulp.dest('./dist'));

});
