// Import the required modules
const { src, dest, series, parallel } = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const del = require('del');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');

// Gulp task to minify CSS files
function styles() {
  return src('src/sass/styles.scss')
    // Compile SASS files
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    // Auto-prefix css styles for cross browser compatibility
    .pipe(autoprefixer())
    // Minify the file
    .pipe(csso())
    // Output
    .pipe(dest('secure/css'));
}

// Gulp task to minify JavaScript files
function scripts() {
  return src('src/js/**/*.js')
    // Minify the file
    .pipe(uglify())
    // Output
    .pipe(dest('secure/js'));
}

// Clean output directory
function clean() {
  return del(['secure']);
}

// Gulp task to minify all files
exports.default = series(clean, parallel(styles, scripts));
