/* eslint-disable */
import angular from 'angular';
import 'c3-angular';
import 'd3';

import 'pdfmake/build/pdfmake';
require('common/pdfGenerator/vfs_fonts.js');

let globalVariablesModule = angular.module('globalVariables', [
])
.service('d3', ( $window ) => {
  'ngInject';
  let d3 = $window.d3;
  return d3;
})
.service('pdfMake', ( $window ) => {
  'ngInject';
  let pdfMake = $window.pdfMake;
  return pdfMake;
})
.name;
export default globalVariablesModule;
