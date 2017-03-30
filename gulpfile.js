var gulp = require('gulp');
var sass = require('gulp-sass');
var ejs = require('gulp-ejs');
var postcss = require('gulp-postcss');
var clean = require('gulp-clean');
var sassLint = require('gulp-sass-lint');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var autoprefixer = require('autoprefixer');
var browserSync = require('browser-sync').create();

gulp.task('dev', ['sass:dev', 'ejs:dev'], function() {
  browserSync.init({
    server: './.gulp-temp',
  });

  gulp.watch('./src/**/*.scss', ['sass:dev']);
  gulp.watch('./index.ejs', ['ejs:dev']).on('change', browserSync.reload);
});

gulp.task('sass:dev', ['lint'], function() {
  return gulp.src('./src/index.scss')
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
    ]))
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

gulp.task('clean:dev', function() {
  return gulp.src('./.gulp-temp', { read: false })
    .pipe(clean());
});

gulp.task('production', function() {
  return gulp.src('./src/index.scss')
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
    ]))
    .pipe(gulp.dest('./lib'));
});

gulp.task('production:min', function() {
  return gulp.src('./src/index.scss')
    .pipe(sass())
    .pipe(postcss([
      autoprefixer(),
    ]))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(rename({
      extname: '.min.css',
    }))
    .pipe(gulp.dest('./lib'));
});

gulp.task('clean:production', function() {
  return gulp.src('./lib', { read: false })
    .pipe(clean());
});

gulp.task('lint', function() {
  return gulp.src('./src/**/*.scss')
    .pipe(sassLint())
    .pipe(sassLint.format());
});

gulp.task('default', ['clean:dev'], function() {
  return gulp.start('dev');
});

gulp.task('build', ['clean:production'], function() {
  return gulp.start(['production', 'production:min']);
});
