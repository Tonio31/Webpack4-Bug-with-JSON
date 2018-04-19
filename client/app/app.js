// External Module
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ngAnimate from 'angular-animate';
import 'normalize.css';
import 'angular-foundation';

// Potentialife module
import Common from './common/common';
import AppComponent from './app.component';



let appModule = angular.module( 'app', [
  'mm.foundation',
  uiRouter,
  Common
] )
.config( ($urlRouterProvider, $stateProvider) => {
  'ngInject';

  $stateProvider
  .state('home', {
    url: `/`,
    component: 'app',
  });

  $urlRouterProvider.otherwise( ( $injector, $location ) => {
    let $state = $injector.get( '$state' );
    $state.go( 'home' );
  } );

})
.run( ($log) => {
  'ngInject';

  try {

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'app::RUN()' );



  }
  catch (error) {
    $log.error('ERROR=', error);
  }
} )
.component( 'app', AppComponent )
.name;

export default appModule;
