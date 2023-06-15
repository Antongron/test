const {src, dest, watch, parallel, series} = require('gulp');

const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');

import imagemin from 'gulp-imagemin';

export default () => (
	gulp.src('/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'))
);

function styles() {
  return src('app/css/style.css')
    .pipe(autoprefixer({overrideBrowserslist: ['last 10 version']}))
    .pipe(concat('style.min.css'))
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(dest('app/css'))
    .pipe(browserSync.stream())
}

function watching() {
  watch(['app/css/style.css'], styles)
  watch(['app/*.html']).on("change", browserSync.reload)
}

function browsersync() {
  browserSync.init({
    server: {
        baseDir: "app/"
    }
});
}

function cleanDist() {
  return src('dist')
    .pipe(clean())
}

function building() {
  return src([
    'app/css/style.min.css',
    'app/**/*.html'
  ], {base: 'app'})
    .pipe(dest('dist'))
}

exports.styles = styles;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = series(cleanDist, building);

exports.default = parallel(styles, browsersync, watching);
