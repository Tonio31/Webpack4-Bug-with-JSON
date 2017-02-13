import angular from 'angular';
import uiRouter from 'angular-ui-router';
import changeLanguageComponent from './changeLanguage.component';

import LogDecorator from 'common/logDecorator/logDecorator';

//Angular Translate, everything needed for translations
import angularTranslate from 'angular-translate';
import angularTranslateStorageLocal from 'angular-translate-storage-local';
import angularTranslateStorageCookie from 'angular-translate-storage-cookie';
import angularTranslateLoaderStaticFiles from 'angular-translate-loader-static-files';
import angularCookie from 'angular-cookies';


import localeEnglish from './languages/locale-en.json';
import localeFrench from './languages/locale-fr.json';
import localeSpanish from './languages/locale-sp.json';
import localeChinese from './languages/locale-cn.json';

let ChangeLanguage = angular.module('changeLanguage', [
  uiRouter,
  angularTranslate,
  LogDecorator,
  angularCookie,
  angularTranslateStorageCookie,
  angularTranslateStorageLocal,
  angularTranslateLoaderStaticFiles
])
.config(($translateProvider) => {
  "ngInject";

  $translateProvider.translations('en', localeEnglish)
    .translations('fr', localeFrench)
    .translations('sp', localeSpanish)
    .translations('cn', localeChinese)
    .registerAvailableLanguageKeys(['en', 'cn', 'fr', 'sp'], {
      'gb': 'en',
      'es': 'sp'
    })
    //Other languages are stored in a json file
    .useStaticFilesLoader({
      prefix: './languages/locale-',
      suffix: '.json'
    })
    .preferredLanguage('en')
    //See http://angular-translate.github.io/docs/#/guide/19_security for more details about Sanitize
    .useSanitizeValueStrategy('escape')
    //If a translation is not available in any language we default to english (https://angular-translate.github.io/docs/#/guide/08_fallback-languages)
    .fallbackLanguage('en')
    //Remember the choice of Language in the local storage
    .useLocalStorage();

})
.component('changeLanguage', changeLanguageComponent)
.name;

export default ChangeLanguage;
