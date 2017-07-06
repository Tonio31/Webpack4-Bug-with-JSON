/* eslint-disable */
import angular from 'angular';
import 'c3-angular';
import 'd3';

let globalVariablesModule = angular.module('globalVariables', [
])
.service('d3', ( $window ) => {
  'ngInject';
  let d3 = $window.d3;
  return d3;
})
.name;
export default globalVariablesModule;
