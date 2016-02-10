var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

gulp.task('start', ['build'], function() {
  nodemon({
    script: './bin/www'
  }).on('start', ['watch']);
});

gulp.task('sass', function() {
  return gulp.src('.src/sass/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./public/stylesheets/'));
});

gulp.task('scripts', function() {
  return gulp.src('./src/charts/models/*.js')
    .pipe(concat('charts.js'))
    .pipe(gulp.dest('./public/scripts/'));
});

gulp.task('build', ['sass', 'scripts']);

gulp.task('watch', function() {
  gulp.watch('./src/**/*.scss', ['styles']);
  gulp.watch('./charts/models/*.js', ['scripts']);
});
