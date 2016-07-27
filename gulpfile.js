var gulp = require('gulp');

var babelify = require('babelify');
var watchify = require('watchify');
var browserify = require('browserify');

var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var merge = require('utils-merge');

var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var jade = require('gulp-jade');
var ngAnnotate = require('browserify-ngannotate');
var karmaServer = require('karma').Server;
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var notify = require("gulp-notify");
var webserver = require('gulp-webserver');
var connect = require('gulp-connect');

function handleErrors() {

  var args = Array.prototype.slice.call(arguments);

  notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);

  this.emit('end'); // Keep gulp from hanging on this task

}

gulp.task('watchify', function () {

  var args = merge(watchify.args, { debug: true });

  var bundler = watchify(browserify('./src/index.js', args)).transform(babelify, {presets: ["es2015"]});

  bundle_js(bundler);

  bundler.on('update', function () {

    bundle_js(bundler)

  });

});

// Without watchify
gulp.task('browserify', function () {

  var bundler = browserify('./src/index.js', { debug: true }).transform(babelify, {presets: ["es2015"]});

  return bundle_js(bundler);

})

function bundle_js(bundler) {

  return bundler.bundle()
    .on('error', handleErrors)
    .pipe(source('index.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dist'))
    .pipe(rename('index.js'))
    .pipe(sourcemaps.init({ loadMaps: true }))
      // capture sourcemaps from transforms
      .pipe(uglify())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist'))
    .pipe(connect.reload());

}

function compileSCSS() {

	gulp.src('src/index.scss')
		.pipe(sass({
				includePaths: ['./node_modules']
			})
			.on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions', 'ie >= 9', 'and_chr >= 2.3']
		}))
		.pipe(rename('index.css'))
		.pipe(gulp.dest('./dist'))
		.pipe(connect.reload());

}

function copyIndex() {

  gulp.src('src/index.html')
    .pipe(gulp.dest('dist/'));

}

function copyContent() {

  gulp.src('src/content/**/*.html')
    .pipe(gulp.dest('dist/content'));

}

function copyImages() {

  gulp.src('src/image/**/*.{jpg,svg,png,gif}')
    .pipe(gulp.dest('dist/image'));

}


gulp.task('copy-index', copyIndex);

gulp.task('compile-scss', compileSCSS);

gulp.task('copy-content', copyContent);

gulp.task('copy-image', copyImages);

gulp.task('connect', function() {

  connect.server({
    root: 'dist',
    livereload: true,
    fallback: 'dist/index.html'
  });

});

gulp.task('default', ['watch', 'watchify', 'connect']);

gulp.task('watch', function() {

	gulp.watch('src/index.html', ['copy-index']);
	gulp.watch('src/**/*.scss', ['compile-scss']);
  gulp.watch('src/content/**/*.html', ['copy-content']);
  gulp.watch('src/image/**/*.{jpg,svg,png,gif}', ['copy-image']);

});
