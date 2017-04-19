/* eslint-disable */

import angular from 'angular';
require('lodash/core');

let globalVariablesModule = angular.module('globalVariables', [
])
.factory('_', ( $window ) => {
  'ngInject';
  let _ = $window._;

  return ( _ );
})
.service('d3', ( $window ) => {
  'ngInject';
  let d3 = $window.d3;

  return d3;
})
.name;

export default globalVariablesModule;
