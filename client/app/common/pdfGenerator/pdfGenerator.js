import angular from 'angular';
import angularResource from 'angular-resource';
import LogDecorator from 'common/logDecorator/logDecorator';
import PdfGeneratorFactory from './pdfGenerator.factory';
import ResourceFactory from 'common/resourceFactory/resource';
import globalVariable from 'app/globalVariables';

let pdfGeneratorModule = angular.module('pdfGenerator', [
  angularResource,
  ResourceFactory,
  LogDecorator,
  globalVariable
])

.factory('PdfGenerator', PdfGeneratorFactory)

.name;

export default pdfGeneratorModule;
