import angular from 'angular';
require('lodash/core');

let globalVariablesModule = angular.module('globalVariables', [
])
.factory('_', function( $log, $window ) {
  "ngInject";
  var _ = $window._;

  $log.log("TONIO We are inside the .factory('_',");

  return ( _ );
})
.name;

export default globalVariablesModule;
