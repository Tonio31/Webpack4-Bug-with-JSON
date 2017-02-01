import angular from 'angular';
import uiRouter from 'angular-ui-router';
import Common from './common/common';
import Components from './components/components';
import AppComponent from './app.component';
import 'normalize.css';
import angularTranslate from 'angular-translate';

require('angular-foundation');


angular.module('app', [
    'mm.foundation',
    angularTranslate,
    uiRouter,
    Common,
    Components
  ])
  .config(($locationProvider, $translateProvider) => {
    "ngInject";
    // @see: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions
    // #how-to-configure-your-server-to-work-with-html5mode
    $locationProvider.html5Mode(true).hashPrefix('!');

    $translateProvider.translations('en', {
      TITLE: "Translation is working",
      ANOTHER_TEXT: "But is it really working"
    })
      .preferredLanguage('en')
      //See http://angular-translate.github.io/docs/#/guide/19_security for more details about Sanitize
      .useSanitizeValueStrategy('escape');

  })

  .component('app', AppComponent);
