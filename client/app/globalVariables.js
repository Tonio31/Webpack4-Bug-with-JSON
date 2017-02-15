import angular from 'angular';
require('lodash/core');

let globalVariablesModule = angular.module('globalVariables', [
])
.factory('_', ( $window ) => {
  'ngInject';
  let _ = $window._;

  return ( _ );
})
.name;

export default globalVariablesModule;
