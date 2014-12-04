gulp-inline-style
=================

Replace link tags with inline style tags to save http requests

how-to-use
=================

    var gulp = require('gulp');
    var inlineStyle = require('gulp-inline-style');

    var paths = {
        html: 'src/html/*.htm'
    };

    //final step: replace linkStyle using style tag containing CSS content in build dir.
    gulp.task('final',  function() {
        return gulp.src(paths.html)
            .pipe(inlineStyle('build/css/'))
            .pipe(gulp.dest('build/html'));
    });
