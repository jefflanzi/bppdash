var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

gulp.task('start', ['sass', 'scripts'], function() {
  nodemon({
    script: './bin/www'
  }).on('start', ['watch']);
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

gulp.task('build', function (){
  gulp.start('sass');
  gulp.start('scripts');
});

gulp.task('watch', function() {
  gulp.watch('./**/*.scss', ['styles']);
  gulp.watch('./charts/models/*.js', ['scripts']);
});
