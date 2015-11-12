//Include gulp
var gulp = require('gulp');

//Plugins
var jshint = require('gulp-jshint');
var sass = require('gulp-ruby-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var gutil = require('gulp-util');

gulp.task('scripts', function() {
    return gulp.src('js/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename('app.min.js'))
        .pipe(uglify().on('error', gutil.log))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('sass', function() {
    return sass('scss/main.scss', {style: 'expanded'})
        .on('error', sass.logError)
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('css'));
});

gulp.task('watch', function() {
    gulp.watch('js/**/*.js', ['scripts']);    
    gulp.watch('scss/**/*.scss', ['sass']);
});


gulp.task('default', ['watch']);