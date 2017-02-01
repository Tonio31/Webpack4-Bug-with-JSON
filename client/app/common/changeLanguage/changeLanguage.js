import angular from 'angular';
import uiRouter from 'angular-ui-router';
import changeLanguageComponent from './changeLanguage.component';

let ChangeLanguage = angular.module('changeLanguage', [
  uiRouter
])

.component('changeLanguage', changeLanguageComponent)
.name;

export default ChangeLanguage;
