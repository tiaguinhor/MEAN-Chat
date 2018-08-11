var path = require('path'),
	gulp = require('gulp'),
	nodemon = require('gulp-nodemon'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	filesize = require('gulp-filesize'),
	sass = require('gulp-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	minifyCSS = require('gulp-minify-css'),
	minifyHTML = require('gulp-htmlmin'),
	ngAnnotate = require('gulp-ng-annotate'),
	browserSync = require('browser-sync'),
	watch = require('gulp-watch'),
	changed = require('gulp-changed');

gulp.task('html', function(){
	// move html to different platforms
	var opts = {removeComments: true, collapseWhitespace: true};

	gulp.src(['src/**/*.html'])
		.pipe(changed('public', {extension: '.html'}))
		.pipe(minifyHTML(opts))
		.pipe(gulp.dest('public'))
		.on('error', function(err){
			console.log(err.message);
		});

	gulp.src(['src/views/index.ejs'])
		.pipe(changed('public/views'))
		.pipe(minifyHTML(opts))
		.pipe(gulp.dest('public/views'))
		.on('error', function(err){
			console.log(err.message);
		});
});

gulp.task('media', function(){
	gulp.src([
		'src/assets/images/**'
	])
		.pipe(changed('public/images'))
		.pipe(gulp.dest('public/images'))
		.on('error', function(err){
			console.log(err.message);
		});

	gulp.src([
		'src/assets/videos/**'
	])
		.pipe(changed('public/videos'))
		.pipe(gulp.dest('public/videos'))
		.on('error', function(err){
			console.log(err.message);
		});

	gulp.src([
		'src/**/*.json'
	])
		.pipe(changed('public'))
		.pipe(gulp.dest('public'))
		.on('error', function(err){
			console.log(err.message);
		});
});

gulp.task('fonts', function(){
	gulp.src([
		'components/components-font-awesome/fonts/**',
		'components/Materialize/dist/font/**',
		'src/assets/fonts/**'
	])
		.pipe(changed('public/fonts'))
		.pipe(gulp.dest('public/fonts'))
		.on('error', function(err){
			console.log(err.message);
		});
});

gulp.task('css', function(){
	gulp.src([
		'components/components-font-awesome/scss/font-awesome.scss',
		'components/Materialize/sass/materialize.scss',
		'src/assets/css/**/*.css',
		'src/assets/scss/style.scss'
	])
		.pipe(changed('public/css', {extension: '.css'}))
		.pipe(sass())
		.pipe(autoprefixer('last 3 version'))
		.pipe(minifyCSS())
		.pipe(concat('style.min.css'))
		.pipe(filesize())
		.pipe(gulp.dest('public/css'))
		.on('error', function(err){
			console.log(err.message);
		});
});

gulp.task('library', function(){
	gulp.src([
		'node_modules/socket.io-client/socket.io.js',
		'components/jquery/dist/jquery.min.js',
		'components/angular/angular.min.js',
		'components/angular-ui-router/release/angular-ui-router.min.js',
		'components/angular-resource/angular-resource.min.js',
		'components/angular-cookies/angular-cookies.min.js',
		'components/angular-sanitize/angular-sanitize.min.js',
		'components/angular-animate/angular-animate.min.js',
		'components/angular-aria/angular-aria.min.js',
		'components/angular-locale-pt-br/angular-locale_pt-br.js',
		'components/angular-socket-io/socket.min.js',
		'components/Materialize/dist/js/materialize.js',
		'src/assets/js/vendors/**/*.js'
	])
		.pipe(changed('public/js', {extension: '.js'}))
		.pipe(concat('libraries.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/js'))
		.pipe(filesize())
		.on('error', function(err){
			console.log(err.message);
		});
});

gulp.task('js', function(){
	gulp.src([
		'src/assets/js/script.js',
		'src/assets/js/app/app.js',
		'src/assets/js/app/**/*.js'
	])
		.pipe(changed('public/js', {extension: '.js'}))
		.pipe(ngAnnotate())
		.pipe(uglify())
		.pipe(concat('script.min.js'))
		.pipe(gulp.dest('public/js'))
		.pipe(filesize())
		.on('error', function(err){
			console.log(err.message);
		});
});

gulp.task('server', ['nodemon'], function(){
	browserSync.init(null, {
		proxy: "http://localhost:3000",
		files: ["public/**/*.*"],
		browser: "google chrome",
		port: 5000
	});
});

gulp.task('nodemon', function(cb){
	var started = false;

	return nodemon({
		script: 'server.js'
	}).on('start', function(){
		if(!started){
			cb();
			started = true;
		}
	});
});

gulp.task('watch', function(){
	var html = gulp.watch(['src/**/*.html'], ['html']);
	var images = gulp.watch(['src/assets/images/**', 'src/assets/videos/**'], ['media']);
	var css = gulp.watch(['src/assets/scss/**'], ['css']);
	var js = gulp.watch(['src/assets/js/**'], ['js']);

	html.on('change', function(file){
		console.log('Event type: ' + file.type);
		console.log('Event path: ' + file.path);
	});
	images.on('change', function(file){
		console.log('Event type: ' + file.type);
		console.log('Event path: ' + file.path);
	});
	css.on('change', function(file){
		console.log('Event type: ' + file.type);
		console.log('Event path: ' + file.path);
	});
	js.on('change', function(file){
		console.log('Event type: ' + file.type);
		console.log('Event path: ' + file.path);
	});
});

// DEFAULT TASK
gulp.task('default', ['html', 'fonts', 'media', 'css', 'library', 'js', 'watch']);