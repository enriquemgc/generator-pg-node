// project files contents for testing

// gulpfiles content for EcmaScript6 configuration
var gulpEs = {
  watchScripts:
`gulp.task('watchScripts', ['processJsFiles'], function () {
  gulp.watch(filesToWatch, ['clean', 'processJsFiles', 'node']);
});`,
  node:
`gulp.task('node', ['processJsFiles'], function () {
  // if node is already running, kill it, if not run a new instance
  if (nodeP) nodeP.kill()
  
  nodeP = spawn('node', [appFileRelPath], { stdio: 'inherit' });

  nodeP.on('close', function(code) { 
    if (code === 8) { gutil.log('Error detected, waiting for changes...'); }
    });
});`,
  clean:
`gulp.task('clean', function () {
  return del(['dist/scripts/main.js']).then();
});`,
  processJsFiles:
`gulp.task('processJsFiles', ['clean'], function () {

});`,
  nodeExitEventHandler:
`process.on('exit', function () {
  if (nodeP) nodeP.kill();
});`,
  defaultTask:
`gulp.task('default', ['clean', 'processJsFiles', 'node', 'watchScripts' ], function () {
});`
};

var jsconfigEs = {
  compilerOptions:
`    "compilerOptions": {
		"target": "ES6",
        "module": "commonjs"
    }`,
  files:
`"files": ["scripts/main.js","gulpfile.js"]`
};

var mainScriptEs = {
  imports:
`var lodash = require('lodash');
var mocha = require('mocha');`,
  strict:
`'use strict';`
};

var gulpTs = {
  watchScripts:
`gulp.task('watchScripts', ['processJsFiles'], function () {
  gulp.watch(filesToWatch, ['clean', 'processJsFiles', 'node']);
});`,
  node:
`gulp.task('node', ['processJsFiles'], function () {
  // if node is already running, kill it, if not run a new instance
  if (nodeP) nodeP.kill()
  
  nodeP = spawn('node', [appFileRelPath], { stdio: 'inherit' });

  nodeP.on('close', function(code) { 
    if (code === 8) { gutil.log('Error detected, waiting for changes...'); }
    });
});`,
  clean:
`gulp.task('clean', function () {
  return del(['dist/scripts/main.js']).then();
});`,
  processJsFiles:
`gulp.task('processJsFiles', ['clean'], function () {
  var tsProject = ts.createProject('tsconfig.json', { sortOutput: true });
  var resStream = tsProject.src('./**/*.ts')
    .pipe(ts(tsProject));
    // Merge the two output streams, so this task is finished when the IO of both operations are done.
  return merge([ 
    resStream.dts.pipe(gulp.dest('dist/typeDefinitions')),
    resStream.js.pipe(gulp.dest('dist'))
  ]);

});`,
  nodeExitEventHandler:
`process.on('exit', function () {
  if (nodeP) nodeP.kill();
});`,
  defaultTask:
`gulp.task('default', ['clean', 'processJsFiles', 'node', 'watchScripts' ], function () {
});`
};

var mainTs = {
  tdReference:
`/// <reference path="../typings/tsd.d.ts" />`
};

var tsconfig = {
  compilerOptions:
`    "compilerOptions": {
        "target": "ES5",
		"module": "commonjs",
		"declaration": true,
        "sourceMap": true
    }`,
  files:
`	"files": ["scripts/main.ts"]`
};

exports.gulpEs = gulpEs;
exports.jsconfigEs = jsconfigEs;
exports.mainEs = mainScriptEs;
exports.gulpTs = gulpTs;
exports.mainTs = mainTs;
exports.tsconfig = tsconfig;