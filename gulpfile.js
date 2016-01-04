var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var concat = require('gulp-concat');
var sass = require('gulp-sass');

gulp.task('css', function() {
  
}
gulp.task('default', function() {
  nodemon({
    script: './bin/www'
  });
});
