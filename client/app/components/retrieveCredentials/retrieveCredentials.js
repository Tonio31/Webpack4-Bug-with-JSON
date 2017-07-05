import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import retrieveCredentialsComponent from './retrieveCredentials.component';
import ResourceFactory from 'common/resourceFactory/resource';
import ConstantModule from 'common/constants';

let retrieveCredentialsModule = angular.module('retrieveCredentials', [
  uiRouter,
  LogDecorator,
  ResourceFactory,
  ConstantModule
])

.component('retrieveCredentials', retrieveCredentialsComponent)
.config(($stateProvider, STATES) => {
  'ngInject';

  $stateProvider
    .state(STATES.RETRIEVE_CREDENTIALS, {
      url: STATES.RETRIEVE_CREDENTIALS,
      parent: STATES.LOGIN_ROOT,
      component: 'retrieveCredentials'
    });
})
.name;

export default retrieveCredentialsModule;
