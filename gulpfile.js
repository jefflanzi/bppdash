var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var cssnano = require('gulp-cssnano');
var stylish = require('jshint-stylish');

gulp.task('start', ['build'], function() {
  nodemon({
    script: './bin/www'
  }).on('start', ['watch']);
});

gulp.task('build', ['sass', 'charts']);

gulp.task('sass', function() {
  return gulp.src('./src/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('lint', function() {
  return gulp.src('./src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter(stylish));
});

gulp.task('charts', function() {
  return browserify({
    entries: './src/charts/charts.main.js',
    standalone: 'charts'
  })
  .bundle()
  .pipe(source('charts.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest('./public/scripts'));
});

gulp.task('watch', function() {
  gulp.watch('./src/**/*.scss', ['styles']);
  gulp.watch('./src/charts/**/*.js', ['charts']);
});
