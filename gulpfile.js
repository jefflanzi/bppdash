var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

gulp.task('default', ['sass', 'scripts'], function() {
  nodemon({
    script: './bin/www'
  });
});

gulp.task('sass', function() {
  gulp.src('./charts/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('scripts', function() {
  gulp.src('./charts/*.js')
    .pipe(concat('charts.js'))
    .pipe(gulp.dest('./public/scripts'));
});

gulp.watch('./charts/*.scss', ['sass']);
gulp.watch('./charts/*.js', ['scripts']);
