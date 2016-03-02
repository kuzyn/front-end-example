//////////////////////////////////////
// Simple task to update our views  //
//////////////////////////////////////

var gulp = require('gulp');
var bs = require('browser-sync').create();

gulp.task('browser-sync', function() {
    bs.init({
        server: {
            baseDir: "./"
        },
        browser: "chromium-browser"
    });
});

// the real stuff
gulp.task('default', ['browser-sync'], function () {
	gulp.watch('./index.html', bs.reload);
	gulp.watch('./app/**/*.js', bs.reload);
	gulp.watch('./assets/**/*.*', bs.reload);
});
