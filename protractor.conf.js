require("babel-register");

let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
var path = require('path');

exports.config = {
  specs: [
   // './e2eTesting/Cycle1_module1.spec.js',
    './e2eTesting/Cycle1_module2.spec.js'
   // './e2eTesting/*.spec.js'
  ],

  // seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: './node_modules/protractor/node_modules/webdriver-manager/selenium/selenium-server-standalone-3.4.0.jar',

  capabilities: {
    browserName: 'chrome'
    //'shardTestFiles': true,

    // chromeOptions: {
    //   args: [ "--headless" ]
    // }
    // 'maxInstances': 3
  },

  // Maximum time Protractor will wait for Angularjs to finish all asynch requests (in ms)
  allScriptsTimeout: 30000,

  // url where your app is running, relative URLs are prepending with this URL
  baseUrl: '',
  // chromeOnly:true,
  // directConnect: true,

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: () => {}
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

    jasmine.getEnv().addReporter(new SpecReporter({
      suite: {
        displayNumber: true
      },
      spec: {
        displayStacktrace: true,
        displayErrorMessages: true,
        displayDuration: true,
        displayPending: true
      }
    }));
  },
};
