import 'bugsnag-js';

import angular from 'angular';
import angularResource from 'angular-resource';
import ExceptionHandlerFactory from './bugnsag.factory';
import UserDataFactory from 'common/userDataFactory/userData';
import angularBugsnag from 'angular-bugsnag';

let exceptionOverrideModule = angular.module('bugsnagModule', [
  angularResource,
  angularBugsnag,
  UserDataFactory
])
  .factory('bugsnagFactory', ExceptionHandlerFactory)
  .config( ($provide, bugsnagProvider) => {
    'ngInject';

    bugsnagProvider
      .noConflict()
      .apiKey('b9056a2472100fb8471f4d10f264047e')
      .releaseStage(ENVIRONMENT)
      .appVersion(VERSION)
      .beforeNotify( 'bugsnagFactory' );
  })
  .name;

export default exceptionOverrideModule;
