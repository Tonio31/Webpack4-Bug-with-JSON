/* eslint-disable camelcase */
/* eslint-disable angular/timeout-service */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable no-unreachable */
/* eslint-disable no-useless-escape */
/* eslint-disable angular/no-run-logic */

// External Module
import angular from 'angular';
import 'angular-mocks/ngMockE2E';

import App from './app';


// This module is for local dev only, if we choose this file as the entry point, it will include ngMockE2E,
// including this module will intercept all HTTP requests, this allow working in standalone on the client side
// All the 'fake' http response should be here

angular.module( 'appMockBackEnd', [
  App,
  'ngMockE2E'
])
.run( ($log, $httpBackend) => {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('appMockBackEnd::RUN');


  $httpBackend.whenGET(/(.*)\.mp4/).passThrough();
  $httpBackend.whenGET(/(.*)\.jpg/).passThrough();

  const ID_FIRST_USER = '51';
  const ID_TONIO_USER = '129';

  // Import all the json files at once
  // See https://webpack.js.org/guides/dependency-management/
  let cache = {};

  let importAll = (r) => {
    r.keys().forEach( (key) => {
      cache[key] = r(key);
      return;
    });
  };

  importAll(require.context('./mockBackEndResponse/', true, /\.json$/));
});
