'use strict';

var generators = require('yeoman-generator');
var _s = require('underscore.string');
var chalk = require('chalk');
var _ = require('lodash');
var formatedModData = require('./aux.js').formatedModData;
var es = 'EcmaScript6';
var ts = 'TypeScript';



module.exports = generators.Base.extend({

  constructor: function () {
    generators.Base.apply(this, arguments);

    this.argument('appName', {
      type: String,
      required: false,
      desc: 'app name'
    });
  },

  initializing: function () {
    this.projConfig = {}; // stores configuration data for the generated project

  },

  prompting: function () {
    var done = this.async();
    var userInputs = {};

    var prompts = {
      appName: {
        type: 'input',
        name: 'appName',
        message: 'name this playground'
      },
      language: {
        type: 'list',
        name: 'language',
        message: 'What language will be your project based on?',
        choices: [
          es,
          ts
        ]
      },
      tsTypes: {
        type: 'input',
        name: 'tsTypes',
        message: 'What ' + chalk.cyan('type decriptions') + ' do you want me to install? (no answer » none) ex: "node express"',
        default: function () { return []; }
      },
      npmMods: {
        type: 'input',
        name: 'npmMods',
        message: 'What ' + chalk.cyan('npm modules') + 'do you want me to install?(no answer » none) ex: "mocha lodash"',
        default: function () { return []; }
      }
    };

    function answerHandler(answers) {
      var nextPrompts = [];
      userInputs = _.assign(userInputs, answers);

      // normalize answers and store them
      if (answers.tsTypes) { userInputs.tsTypes = _s.words(answers.tsTypes); }
      if (answers.npmMods) { userInputs.npmMods = _s.words(answers.npmMods); }

      // find derived questions to prompt
      // last question round determines the next one
      if (answers.language === es) { nextPrompts.push(prompts.npmMods); }
      if (answers.language === ts) { nextPrompts.push(prompts.tsTypes); }
      if (answers.appName) { nextPrompts.push(prompts.language); }


      // if there are prompts to prompt, make the prompter prompt them
      if (nextPrompts.length !== 0) {
        return this.prompt(nextPrompts, answerHandler.bind(this));
      }
      // if no more prompts are needed end prompting
      this.userInputs = userInputs;
      done();
    }

    // initial prompt
    if (this.appName) {
      this.prompt(prompts.language, answerHandler.bind(this));
    } else {
      this.prompt(prompts.appName, answerHandler.bind(this));
    }
  },

  configuring: function () {
    this.rootDir = this.appName
      ? this.appName = _s.camelize(this.appName)
      : this.userInputs.appName = _s.camelize(this.userInputs.appName);
    this.destinationRoot(this.rootDir);

    if (this.userInputs.language === es) {
      this.projConfig.mainPath = 'scripts/main.js';
      this.projConfig.filesToWatch = ['scripts/main.js'];
    }
    if (this.userInputs.language === ts) {
      // pull out node, it is required as individual modules, not the whole API
      this.tsdToRequire = _.pull(this.userInputs.tsTypes, 'node');
      // node is included due to its frequent use
      this.tsdToInstall = _.union(this.userInputs.tsTypes, ['node']);
      // npm modules to install
      this.npmModsToInstall = _.pull(this.userInputs.tsTypes, 'node');
      // main script to run as default
      this.projConfig.mainPath = 'dist/scripts/main.js';
      this.projConfig.filesToWatch = ['scripts/main.ts'];
    }
  },

  writing: function () {
    this.fs.copyTpl(
        this.templatePath('package.json'),
        this.destinationPath('package.json'),
        {
          main: this.projConfig.mainPath,
          name: this.appName
        }
      );
    this.fs.copyTpl(
      this.templatePath('gulpfile.ejs'),
      this.destinationPath('gulpfile.js'),
      {
        filesToWatch: this.projConfig.filesToWatch,
        language: this.userInputs.language,
        es: es,
        ts: ts
      }
    );
    if (this.userInputs.language === es) {
      this.fs.copyTpl(
        this.templatePath('scripts/main.es.ejs'),
        this.destinationPath('scripts/main.js'),
        {
          modules: this.userInputs.npmMods.map(formatedModData)
        }
      );
      this.fs.copyTpl(
        this.templatePath('jsconfig.ejs'),
        this.destinationPath('jsconfig.json'),
        {files: JSON.stringify([
          'scripts/main.js',
          'gulpfile.js'
          ])}
      );
    }
    if (this.userInputs.language === ts) {
      this.fs.copyTpl(
        this.templatePath('scripts/main.ts.ejs'),
        this.destinationPath('scripts/main.ts'),
        {
          modules: this.tsdToRequire.map(formatedModData)
        }
        );
      this.fs.copyTpl(
        this.templatePath('tsd.json'),
        this.destinationPath('tsd.json'),
        {}
      );
      this.fs.copyTpl(
        this.templatePath('tsconfig.ejs'),
        this.destinationPath('tsconfig.json'),
        {files: JSON.stringify([
          'scripts/main.ts'
          ])}
      );
    }
    // TODO: add gitignore
  },
  install: function () {
    // local installations
    this.npmInstall([
      'gulp',
      'gulp-concat',
      'gulp-util',
      'del',
      'eslint',
      'jshint'
    ], {
        'save': true
      });
    // global installations
    this.npmInstall([
      'jshint'
    ], {
        'save': true,
        'global': true
      });

    if (this.userInputs.language === ts) {
      this.npmInstall([
        'gulp-typescript',
        'merge2',
        'typescript',
        'tsd'
      ], {
          'save': true
      });

      this.npmInstall(this.npmModsToInstall, { save: true });
      this.runInstall('tsd', this.tsdToInstall , { save: true });
    }
    if (this.userInputs.language === es){
        this.npmInstall(this.userInputs.npmMods, { 'save': true });
    }
  }
});
