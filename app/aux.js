'use strict';

var _s = require('underscore.string');



/**
* 
* receives a module name and returns a variable like name.
* an string '@user/module-name' produces 'modName'.
*
* @param {string} modName | module name string with no white spaces
*
* @returns {string} camelCased module name
*
* @api protected
*
*/ 
function normalizedModName(modName) {
		var varLikeName = modName;
		
		// '@scope/module-name.sample' » '/module-name.sample'
		var scopedModName = modName.match(/\/.*/);
		if (scopedModName) { varLikeName = scopedModName[0].substr(1); }
		varLikeName = _s.camelize(varLikeName);

		return varLikeName;
}

/**
* 
* wraps received module name and its normalize name in an object 
* module name is transformed so it follows javascript variable name conventions(camelCase).
*
* @param {string} modName | Module name
*
* @returns {{modName: string, varLikeName: string}!}
*
* @api public
*
*/
exports.formatedModData = function (modName) {
	var normMod = {};
	
	normMod.name = modName;
	normMod.varLikeName = normalizedModName(modName);
	
	return normMod;
};

