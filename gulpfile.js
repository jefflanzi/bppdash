var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var mocha = require('gulp-mocha');


gulp.task('default', function() {
  nodemon({
    script: './bin/www'
  }).on('start', ['test', 'watch']);
});

gulp.task('sass', function() {
  return gulp.src('./sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('scripts', function() {
  return gulp.src('./charts/models/*.js')
    .pipe(concat('charts.js'))
    .pipe(gulp.dest('./public/scripts'));
});

gulp.task('build', ['sass', 'scripts']);

gulp.task('watch', function() {
  gulp.watch('./**/*.scss', ['styles']);
  gulp.watch('./charts/models/*.js', ['scripts']);
});

gulp.task('test', ['build'], function() {
  return gulp.src('test/routes.test.js')
    .pipe(mocha());
});
