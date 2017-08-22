import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import UtilityFactory from 'common/utility/utility';
import buttonModuleComponent from './buttonModule.component';
import PdfGeneratorFactory from 'common/pdfGenerator/pdfGenerator';

let buttonModuleModule = angular.module('buttonModule', [
  uiRouter,
  UtilityFactory,
  PdfGeneratorFactory,
  LogDecorator
])

.component('buttonModule', buttonModuleComponent)

.name;

export default buttonModuleModule;
