// External Module
import angular from 'angular';
import 'angular-mocks/ngMockE2E';

import App from './app';


// This module is for local dev only, if we choose this file as the entry point, it will include ngMockE2E,
// including this module will intercept all HTTP requests, this allow working in standalone on the client side
// All the "fake" http response should be here

angular.module('appMockBackEnd', [
  App,
  'ngMockE2E'
])
.run(function($log, $httpBackend) {
  "ngInject";

  $httpBackend.whenGET(/\/potentialife-course\/cycle-\d+\/(module-\d+|lifemap)(\/step-\d+)?/).respond(function (method, url) {
    $log.log("$httpBackend.whenGET('" + url + "')");
    let content = require('./mockBackEndResponse/courseContent_step1.json');
    return [200, content, {}];
  });

  $httpBackend.whenGET(/\/menu\/\d+/).respond(function (method, url) {
    // parse the matching URL to pull out the id (/games/:id)
    var userid = url.split('/')[2];
    $log.log("MOCK BackEnd Response. Url=" + url +  ",  method=", method, "   userid=", userid);

    let content = require('./mockBackEndResponse/menu-1.json');
    return [200, content, {}];
  });

  $httpBackend.whenGET(/\/users\/\d+/).respond(function (method, url) {
    // parse the matching URL to pull out the id (/games/:id)
    var userid = url.split('/')[2];
    $log.log("userid=", userid);
    var user = {
      name: "Mock Reply",
      userid: userid
    };
    return [200, user, {}];
  });

});
