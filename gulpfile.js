//////////////////////////////////////
// Simple task to update our views  //
//////////////////////////////////////

var gulp = require('gulp');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var bs = require('browser-sync').create();

// initiating our browser-sync task
gulp.task('browser-sync', function() {
    bs.init({
        server: {
            baseDir: "./"
        },
        browser: "chromium-browser"
    });
});

// our concat task
gulp.task('scripts', function() {
  return gulp.src(['./app/**/*.js'])
    .pipe(concat('app.concat.js'))
    .pipe(notify("Updated <%= file.relative %>"))
    .pipe(gulp.dest('./'));
});

// our default task
gulp.task('default', ['browser-sync'], function () {
	gulp.watch(['./index.html', './app/**/*.html'], bs.reload);
	gulp.watch(['./app/**/*.js'], ['scripts']);
	gulp.watch('./app.concat.js', bs.reload);
	gulp.watch('./assets/**/*.*', bs.reload);
});
