var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

gulp.task('js', function() {
	return gulp.src(['js/*.js', 'gen/*.js'])
		//.pipe(concat('rapidframe.js'))
		.pipe(concat('rapidframe.min.js'))
		//.pipe(uglify())
		.pipe(gulp.dest('.'));
});

gulp.task('watch', ['default'], function() {
	gulp.watch('js/*.js', ['js']);
	gulp.watch('gen/*.js', ['js']);
});

gulp.task('default', ['js']);

