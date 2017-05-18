// var SpecReporter = require("jasmine-spec-reporter");
require("babel-register");
var path = require('path');

exports.config = {
  specs: [
    './e2eTesting/*.spec.js'
  ],

  // seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: './node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.4.0.jar',

  capabilities: {
    browserName: 'chrome',
    //'shardTestFiles': true,

    chromeOptions: {
      args: [ "--headless", "--disable-gpu", "--window-size=800x600" ]
    }
    // 'maxInstances': 3
  },

  // Maximum time Protractor will wait for Angularjs to finish all asynch requests (in ms)
  allScriptsTimeout: 20000,

  // url where your app is running, relative URLs are prepending with this URL
  baseUrl: '',
  // chromeOnly:true,
  // directConnect: true,

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

  // testing framework, jasmine is the default
  framework: 'jasmine2',

  onPrepare: () => {
    /**
     * If you are testing against a non-angular site - set ignoreSynchronization setting to true
     *
     * If true, Protractor will not attempt to synchronize with the page before
     * performing actions. This can be harmful because Protractor will not wait
     * until $timeouts and $http calls have been processed, which can cause
     * tests to become flaky. This should be used only when necessary, such as
     * when a page continuously polls an API using $timeout.
     *
     * @type {boolean}
     */
    browser.ignoreSynchronization = false;

    // jasmine.getEnv().addReporter(
    //   new SpecReporter({
    //     // Defaults: https://github.com/bcaudan/jasmine-spec-reporter#default-options
    //     // Configuration: https://github.com/bcaudan/jasmine-spec-reporter/blob/master/src/configuration.ts
    //     suite: {
    //       displayNumber: true,    // display each suite number (hierarchical)
    //     },
    //     spec: {
    //       displayPending: true,   // display each pending spec
    //       displayDuration: true,  // display each spec duration
    //     },
    //     summary: {
    //       displaySuccesses: false, // display summary of all successes after execution
    //       displayFailed: false,    // display summary of all failures after execution
    //       displayPending: false,   // display summary of all pending specs after execution
    //     },
    //   }),
    // );
  },
};
