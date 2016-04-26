// Load plugins
var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  notify = require('gulp-notify'),
  cleanCSS = require('gulp-clean-css'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  rename = require('gulp-rename'),
  htmlreplace = require('gulp-html-replace'),
  htmlMin = require('gulp-htmlmin'),
  concat = require('gulp-concat'),
  notify = require('gulp-notify'),
  cache = require('gulp-cache'),
  critical = require('critical').stream,
  browserSync = require('browser-sync'),
  runSequence = require('run-sequence'),
  defer = require('gulp-defer'),
  del = require('del');

// Sources
var images = 'img/*.{gif,jpg,png,svg}';
var imagePizza  = 'views/images/*.{gif,jpg,png,svg}';
var js = [
  'js/perfmatters.js',
  'views/js/main.js'
];
var css = [
  'css/print.css',
  'css/style.css',
  'views/css/bootstrap-grid.css',
  'views/css/style.css'
];
var html = [
  'index.html',
  'project-2048.html',
  'project-mobile.html',
  'project-webperf.html'
];
var htmlPizza = 'views/pizza.html';

//Optimize Images
gulp.task('images', function() {
  return [
    gulp.src(images)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img')),

    gulp.src(imagePizza)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/views/images'))
    .pipe(notify({ message: 'Images have been optimized' }))
  ]
});

// Move scripts to bottom of html pages
// Generate & Inline Critical-path CSS for above the fold content
// Minify html
gulp.task('inline', function () {
  return [
    gulp.src(html)
    .pipe(htmlreplace({js: 'js/perfmatters.min.js'}))
    .pipe(defer())
    .pipe(critical({base: 'tmp', inline: true, minify: true, css: [css[0], css[1]] }))
    .pipe(htmlMin({collapseWhitespace: true}))
    //.pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist')),

    gulp.src(htmlPizza)
    .pipe(htmlreplace({js: 'js/main.min.js'}))
    .pipe(defer())
    .pipe(critical({base: 'tmp', inline: true, minify: true, css: [css[2], css[3]] }))
    .pipe(htmlMin({collapseWhitespace: true}))
    //.pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/views'))

    .pipe(notify({ message: 'CSS inlined and HTML minified' }))
  ]
});

// Delete leftover temp files from 'critical' plugin
gulp.task('del', function() {
  del([ 'tmp/**', '!tmp' ])
});

// Minify CSS files
gulp.task('cssMin', function() {
  return [
  gulp.src('css/*.css')
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(gulp.dest('dist/css')),

  gulp.src('views/css/*.css')
  .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/views/css'))
  ]
})

// Minify JS
gulp.task('scripts', function() {
  return [
    gulp.src(js[1])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/views/js')),

    gulp.src(js[0])
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'JS minified' }))
  ]
});

// Lint JS
gulp.task('lint', function() {
  return gulp.src(js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'JS lint complete' }));
});

//Browsersync
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });
});

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch(js ['lint', 'scripts']).on('change', browserSync.reload);
  gulp.watch(css ['critical']).on('change', browserSync.reload);
  gulp.watch(html ['useref']).on('change', browserSync.reload);
  gulp.watch(htmlPizza ['useref']).on('change', browserSync.reload);
});

// Default Task
gulp.task('default', ['del'], function() {
  runSequence('inline', ['scripts', 'cssMin', 'images', 'lint', 'watch', 'browser-sync'] )
});
