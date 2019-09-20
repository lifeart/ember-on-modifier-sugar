'use strict';

const { cacheKeyForStableTree } = require('calculate-cache-key-for-tree');

module.exports = {
  name: require('./package').name,

  cacheKeyForTree: cacheKeyForStableTree,

  setupPreprocessorRegistry(type, registry) {
      let pluginObj = this._buildPlugin();

      pluginObj.parallelBabel = {
        requireFile: __filename,
        buildUsing: '_buildPlugin',
        params: {},
      };

      registry.add('htmlbars-ast-plugin', pluginObj);
    
  },

  _buildPlugin() {
    return {
      name: 'on-modifier-sugar',
      plugin: require('./lib/ast-transform'),
      baseDir() {
        return __dirname;
      },
    };
  }
};