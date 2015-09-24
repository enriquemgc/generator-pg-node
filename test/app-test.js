'use strict';

var path = require('path');
var testHelpers = require('yeoman-generator').test;
var assert = require('yeoman-generator').assert;
var fs = require('fs');
var codeSt = require('./code-strings.js');


describe('yo pg-node with EcmaScript6 option', function(){


	before(function(done) {
		testHelpers.run(path.join(__dirname, '../app'))
		.inDir(path.join(__dirname, './tmp'))
		.withArguments(['test pg-Node es 6'])
		.withPrompts({
			language:'EcmaScript6',
			npmMods: 'lodash mocha'
		})
		.on('end', done);
	});

	it('creates expected files', function () {
		var expectedFiles = [
			'../testPgNodeEs6',
			'package.json',
			'gulpfile.js',
			'scripts/main.js',
			'jsconfig.json'
		];
    	assert.file(expectedFiles);
  	});
	// package.json
	it('should render main field in package.json as "scripts/main.js"', function(){
		assert.fileContent('package.json', /\"main\"\s*:\s*\"scripts\/main\.js\"/);
	});
	it('should contain version field with some valid value', function(){
		assert.fileContent('package.json', /\"version\"\s*:\s*\"\d\.\d\.\d\"/);
	});
	it('should render name field as "testPgNodeEs6" in package.json', function(){
		assert.fileContent('package.json', /\"name\"\s*:\s*\"testPgNodeEs6\"/);
	});
	// gulpfile
	it('should render files to watch correctly in gulpfile' , function(){;
		var filesToWatchDec = fs.readFileSync('gulpfile.js', 'utf8')
		.match(/var\sfilesToWatch\s=\s.*;/);
		var filesTowatch = filesToWatchDec[0].match(/\[.*\]/)[0];
		// quoting is important here. "['modname']" !== '["modname"]'
		assert.textEqual('["scripts/main.js"]', filesTowatch);
	});
	it('should contain a node process handling task', function(){
		assert.fileContent('gulpfile.js', codeSt.gulpEs.node);
	});
	it('should contain a watching task', function(){
		assert.fileContent('gulpfile.js', codeSt.gulpEs.watchScripts);
	});
	it('should contain a clean task', function(){
		assert.fileContent('gulpfile.js', codeSt.gulpEs.clean);
	});
	it('should contain an empty process scripts task', function(){
		assert.fileContent('gulpfile.js', codeSt.gulpEs.processJsFiles);
	});
	it('should contain an exit event handler for gulp', function(){
		assert.fileContent('gulpfile.js', codeSt.gulpEs.nodeExitEventHandler);
	});
	it('should not render typescript code in gulpfile', function(){
		assert.noFileContent('gulpfile.js', 'var ts = require(\'gulp-typescript\');');
		assert.noFileContent('gulpfile.js', 'var merge = require(\'merge2\');');
		assert.fileContent('gulpfile.js', codeSt.gulpEs.processJsFiles);
	});
	// jsconfig.json
	it('should containe spected compiler options', function(){
		assert.fileContent('jsconfig.json', codeSt.jsconfigEs.compilerOptions);
	});
	it('should containe initial js files in "field" files', function(){
		assert.fileContent('jsconfig.json', codeSt.jsconfigEs.files);
	});
	// scripts/main.js
	it('should declare main.js script as strict mode', function(){
		assert.fileContent('scripts/main.js', codeSt.mainEs.strict);
	});// TODO: regexp requires in main.js
	it('should import modules we asked for in prompt', function(){
		assert.fileContent('scripts/main.js', codeSt.mainEs.imports);
	});
	// TODO: check gulpfiles acomplishes tasks correctly by testing each task
	// not the content
});


describe('yo pg-node with TypeScript option', function(){

	before(function(done) {
		testHelpers.run(path.join(__dirname, '../app'))
		.inDir(path.join(__dirname, './tmp'))
		.withArguments(['testPgNodeTs'])
		.withPrompts({
			language:'TypeScript',
			tsTypes: 'lodash mocha'
		})
		.on('end', done);
	});

	it('creates expected files', function () {
		var expectedFiles = [
			'../testPgNodeTs',
			'package.json',
			'gulpfile.js',
			'scripts/main.ts',
			'tsd.json',
			'tsconfig.json'
		];

    	assert.file(expectedFiles);
  	});
	// package.json
	it('should render main field in package.json as "scripts/main.js"', function(){
		assert.fileContent('package.json', /\"main\"\s*:\s*\"dist\/scripts\/main\.js\"/);
	});
	it('should contain version field with some valid value', function(){
		assert.fileContent('package.json', /\"version\"\s*:\s*\"\d\.\d\.\d\"/);
	});
	it('should render name field as "testPgNodeEs6" in package.json', function(){
		assert.fileContent('package.json', /\"name\"\s*:\s*\"testPgNodeTs\"/);
	});
	// gulpfile.json
	it('should render files to watch correctly in gulpfile' , function(){;
		var filesToWatchDec = fs.readFileSync('gulpfile.js', 'utf8')
		.match(/var\sfilesToWatch\s=\s.*;/);
		var filesTowatch = filesToWatchDec[0].match(/\[.*\]/)[0];
		// quoting is important here. "['modname']" !== '["modname"]'
		assert.textEqual('["scripts/main.ts"]', filesTowatch);
	});
	it('should contain a node process handling task', function(){
		assert.fileContent('gulpfile.js', codeSt.gulpTs.node);
	});
	it('should contain a watching task', function(){
		assert.fileContent('gulpfile.js', codeSt.gulpTs.watchScripts);
	});
	it('should contain a clean task', function(){
		assert.fileContent('gulpfile.js', codeSt.gulpTs.clean);
	});
	it('should contain a process scripts task', function(){
		assert.fileContent('gulpfile.js', codeSt.gulpTs.processJsFiles);
	});
	it('should contain an exit event handler for gulp', function(){
		assert.fileContent('gulpfile.js', codeSt.gulpTs.nodeExitEventHandler);
	});
	it('should require typescript related modules in gulpfile', function(){
		assert.fileContent('gulpfile.js', 'var ts = require(\'gulp-typescript\');');
		assert.fileContent('gulpfile.js', 'var merge = require(\'merge2\');');
	});
	// scripts/main.ts
	it('should containe reference importing sentence for TypeScript type definitions', function(){
		assert.fileContent('scripts/main.ts', codeSt.mainTs.tdReference);
	});
	it('should import modules we asked for in prompt', function(){
		assert.fileContent('scripts/main.ts', /import\s*\*\s*as\s*lodash\s*from\s*\'lodash\'/);
		assert.fileContent('scripts/main.ts', /import\s*\*\s*as\s*mocha\s*from\s*\'mocha\'/);
	});
	// tsconfig.js
	it('should contain compiler options', function(){
		assert.fileContent('tsconfig.json', codeSt.tsconfig.compilerOptions);
	});
	it('should contine files', function(){
		assert.fileContent('tsconfig.json', codeSt.tsconfig.files);
	});
	// TODO: check gulpfiles acomplishes tasks correctly by testing each taskMmm
	// not the content
});
