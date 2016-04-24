// Load plugins
var gulp = require('gulp'),
  jshint = require('gulp-jshint'),
  notify = require('gulp-notify'),
  minifycss = require('gulp-minify-css'),
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
  del = require('del');

// Sources
var images = [
  'img/2048.png',
  'img/cam_be_like.jpg',
  'img/mobilewebdev.jpg',
  'img/profilepic.jpg'
];
var imagePizza  = [
  'views/images/pizza.png',
  'views/images/pizzeria.jpg'
];
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
var htmlPizza = [
  'views/pizza.html'
];

//Optimize Images
gulp.task('images', function() {
  return [
    gulp.src(images)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/img')),

    gulp.src(imagePizza)
    .pipe(cache(imagemin({ optimizationLevel: 5, progressive: true, interlaced: true })))
    .pipe(gulp.dest('dist/views/images'))
    .pipe(notify({ message: 'Images have been optimized' })
  ]
});

// Generate & Inline Critical-path CSS, then minify html
gulp.task('cssMinify', function () {
  return [
    gulp.src(html)
    .pipe(critical({base: 'tmp', inline: true, minify: true, css: [css[0], css[1]] }))
    .pipe(htmlreplace({js: 'js/perfmatters.min.js'}))
    .pipe(htmlMin({collapseWhitespace: true}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist')),

    gulp.src(htmlPizza)
    .pipe(critical({base: 'tmp', inline: true, minify: true, css: [css[2], css[3]] }))
    .pipe(htmlreplace({js: 'js/main.min.js'}))
    .pipe(htmlMin({collapseWhitespace: true}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/views'))

    .pipe(notify({ message: 'CSS inlined and HTML minified' }))
  ]
});

// Delete leftover temp files from 'critical' plugin
gulp.task('del', function() {
  del([ 'tmp/**', '!tmp' ])
});

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
  runSequence('cssMinify', ['scripts', 'images', 'lint', 'watch', 'browser-sync'] )
});