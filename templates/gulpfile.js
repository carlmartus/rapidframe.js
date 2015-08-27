var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

// Bundle code
gulp.task('js', function() {
	// gen/*.js is for generated source
	return gulp.src(['js/*.js', 'gen/*.js'])
		.pipe(concat('book.min.js'))
		//.pipe(uglify()) // Not recomended during development
		.pipe(gulp.dest('www'));
});

// Need to compile external resources?
gulp.task('compile', shell.task(['[command]']));

// Watch for file changes
gulp.task('watch', ['default'], function() {
	gulp.watch('js/*.js', ['js']);
	gulp.watch('gen/*.js', ['js']);
});

gulp.task('default', ['js', 'compile']);

