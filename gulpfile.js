var gulp = require('gulp');
var sass = require('gulp-sass');
var ejs = require('gulp-ejs');
var clean = require('gulp-clean');
var browserSync = require('browser-sync').create();

gulp.task('dev', ['sass:dev', 'ejs:dev'], function() {
  browserSync.init({
    server: './.gulp-temp',
  });

  gulp.watch('./src/**/*.scss', ['sass:dev']);
  gulp.watch('./index.ejs', ['ejs:dev']).on('change', browserSync.reload);
});

gulp.task('sass:dev', function() {
  return gulp.src('./src/index.scss')
    .pipe(sass())
    .pipe(gulp.dest('./.gulp-temp'))
    .pipe(browserSync.stream());
});

gulp.task('ejs:dev', function() {
  return gulp.src('./index.ejs')
    .pipe(ejs(null, null, {
      ext: '.html',
    }))
    .pipe(gulp.dest('./.gulp-temp'));
});

gulp.task('clean', function() {
  return gulp.src('./.gulp-temp', { read: false })
    .pipe(clean());
});

gulp.task('default', ['clean'], function() {
  return gulp.start('dev');
});
