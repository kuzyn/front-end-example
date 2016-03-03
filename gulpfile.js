//////////////////////////////////////
// Simple task to update our views  //
//////////////////////////////////////

var gulp = require('gulp');
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

// our default task
gulp.task('default', ['browser-sync'], function () {
	gulp.watch('./index.html', bs.reload);
	gulp.watch('./app/**/*.js', bs.reload);
	gulp.watch('./assets/**/*.*', bs.reload);
});
