import angular from 'angular';
import angularResource from 'angular-resource';
import ExceptionHandlerFactory from './bugnsag.factory';
import BugsnagUtilsFactory from './bugsnag.utils.factory';
import UserDataFactory from 'common/userDataFactory/userData';
import LogDecorator from 'common/logDecorator/logDecorator';
import angularBugsnag from './angular-bugsnag';
import constantModule from 'common/constants';

let bugsnagModule = angular.module('bugsnagModule', [
  angularResource,
  angularBugsnag,
  LogDecorator,
  constantModule,
  UserDataFactory
])
  .factory('BugsnagUtils', BugsnagUtilsFactory)
  .factory('bugsnagFactory', ExceptionHandlerFactory)
  .config( ($provide, bugsnagProvider) => {
    'ngInject';

    bugsnagProvider
      .noConflict()
      .apiKey('b9056a2472100fb8471f4d10f264047e')
      .setBreadcrumbLimit(20)
      .releaseStage(ENVIRONMENT)
      .appVersion(VERSION)
      .beforeNotify( 'bugsnagFactory' );
  })
  .name;

export default bugsnagModule;
