import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import companyBannerComponent from './companyBanner.component';
import UserDataFactory from 'common/userDataFactory/userData';

let companyBannerModule = angular.module('companyBanner', [
  uiRouter,
  LogDecorator,
  UserDataFactory
])

.component('companyBanner', companyBannerComponent)

.name;

export default companyBannerModule;
