//External Module
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
.run(function($httpBackend) {
  "ngInject";

  $httpBackend.whenGET('/usersThatWorks').respond(function (method, url, data) {
    console.log("$httpBackend.whenGET('/usersThatWorks')");
    var games = {};
    return [200, games, {}];
  });

  $httpBackend.whenGET(/\/menu\/\d+/).respond(function (method, url, data) {
    // parse the matching URL to pull out the id (/games/:id)
    var userid = url.split('/')[2];
    console.log("MOCK BackEnd Response. Url=" + url +  ",  method=", method);
    var menu = require('./mockBackEndResponse/menu-1.json');
    return [200, menu, {}];
  });

  $httpBackend.whenGET(/\/users\/\d+/).respond(function (method, url, data) {
    // parse the matching URL to pull out the id (/games/:id)
    var userid = url.split('/')[2];
    console.log("tibbfbfdb userid=", userid);
    var user = { name: "Mock Reply"};
    return [200, user, {}];
  });

  $httpBackend.whenGET('/\/users\/\d+/').respond(function (method, url, data) {
    // parse the matching URL to pull out the id (/games/:id)
    var userid = url.split('/')[2];
    console.log("userid=", userid);
    var user = { name: "Mock Reply"};
    return [200, user, {}];
  });

});
