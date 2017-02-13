import angular from 'angular';
require('lodash/core');

let globalVariablesModule = angular.module('globalVariables', [
])
.factory('_', function( $window ) {
  "ngInject";
  var _ = $window._;

  return ( _ );
})
.name;

export default globalVariablesModule;
