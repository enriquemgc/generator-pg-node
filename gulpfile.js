'use strict';

var gulp = require('gulp');
var spawn = require('child_process').spawn;

// configuration variables ---------------------------------------------
// Files to watch for node reloading (i.e. ['server/**/*.js', 'server/*.js'])
var nodeFilesToWatch = [
    'app/**/*.js',
    'app/**/*.ejs',
	'app/**/*.json',
	'test/app-test.js',
	'*.js',
	'*.json'
    ];



// tasks --------------------------------------------------------------
gulp.task('mocha', function(){
	spawn('mocha', { stdio:'inherit' });
});

// watch for changes in node and js-app related files. reload node and/or browser if needed
gulp.task('watch', function() {
  gulp.watch(nodeFilesToWatch, ['mocha']);
});


gulp.task('watchTest', ['watch', 'mocha'], function(){
	console.log('--- will test on file change -----------------------');
});