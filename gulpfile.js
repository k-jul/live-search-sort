const gulp = require('gulp');
const sass = require('gulp-sass');
const gulpImagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const prefixer = require('gulp-autoprefixer');
const plumber = require('gulp-plumber');
const autoprefixBrowsers = ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11'];


gulp.task('server', ['sass'], function() {
    browserSync.init({
        server: "."
    });
    gulp.watch(["./src/scss/*.scss", "./src/scss/**/*.scss"], ['sass']);
    gulp.watch('./src/img/*', ['img']);
    gulp.watch('./src/js/*.js', ['js'])
    gulp.watch("*.html").on('change', browserSync.reload);
});

gulp.task('sass', function() {
  return gulp.src('./src/scss/*.scss')
    .pipe( plumber())
    .pipe(sass({includePaths: require('node-normalize-scss').includePaths}))
    .pipe(prefixer({ browsers: autoprefixBrowsers }))
    .pipe(gulp.dest('./dist/css/')) 
    .pipe(browserSync.stream()); 
});

gulp.task('img', function() {
  return gulp.src('./src/img/*') 
    .pipe(gulpImagemin()) 
    .pipe(gulp.dest('./dist/img/')); 
});

gulp.task('js', function() {
    return gulp.src('./src/js/*')
        .pipe(gulp.dest('./dist/js/'))
})


gulp.task('default', ['sass', 'img', 'js', 'server']);
