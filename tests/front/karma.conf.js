'use strict';
var applicationConfiguration = require('../../config/config');

module.exports = function(config) {
  config.set({
    files: applicationConfiguration.assets.lib.js.concat(applicationConfiguration.assets.js, applicationConfiguration.assets.tests.unit),
    
    basePath: '../../',

    frameworks: ['jasmine'],
    reporters: ['progress'],
    browsers: ['PhantomJS'],
    autoWatch: false,
    singleRun: true,
    colors: true
  });
};
