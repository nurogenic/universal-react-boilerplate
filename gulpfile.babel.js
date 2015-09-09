'use strict';

var gulp   = require('gulp');
var browserify   = require('browserify');
var babelify = require('babelify');
var plugins = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');

var paths = {
  lint: ['./gulpfile.js', './lib/**/*.js'],
  watch: ['./gulpfile.js', './index.js', './lib/**', './test/**/*.js', '!test/{temp,temp/**}'],
  tests: ['./test/**/*.js', '!test/{temp,temp/**}'],
  source: ['./lib/*.js']
};

function reBundle (bundler) {
  return bundler.transform(babelify).bundle().pipe(source("bundle.js"))
  .pipe(gulp.dest('./public/js'))
    .on('error', function () {
      console.log('Browserify Error');
    }
  );
}

function initBundler () {
  var bundler = browserify({
    entries: './app/client.jsx',
    extensions: ['.jsx'],
    debug: true
  });

  bundler.on('log', function (msg) {
    console.log('Browserify: ' + msg);
  });

  return bundler;
}

gulp.task('lint', function () {
  return gulp.src(paths.lint)
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jscs())
    .pipe(plugins.jshint.reporter('jshint-stylish'));
});

gulp.task('istanbul', function (cb) {
  gulp.src(paths.source)
    .pipe(plugins.istanbul()) // Covering files
    .on('finish', function () {
      gulp.src(paths.tests, {cwd: __dirname})
        .pipe(plugins.plumber())
        .pipe(plugins.mocha())
        .pipe(plugins.istanbul.writeReports()) // Creating the reports after tests runned
        .on('finish', function() {
          process.chdir(__dirname);
          cb();
        });
    });
});

gulp.task('scripts', function () {
  var bundler = initBundler();
  return reBundle(bundler);
});

gulp.task('develop', ['scripts'], function (){
  plugins.nodemon({ script: 'index.js', ext: 'js'})
});

gulp.task('bump', ['test'], function () {
  var bumpType = plugins.util.env.type || 'patch'; // major.minor.patch
  return gulp.src(['./package.json'])
    .pipe(plugins.bump({ type: bumpType }))
    .pipe(gulp.dest('./'));
});

gulp.task('test', ['lint', 'istanbul']);
gulp.task('release', ['bump']);
gulp.task('default', ['develop']);
