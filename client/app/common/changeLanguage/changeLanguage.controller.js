class changeLanguageController {
  constructor($log, $translate) {
    "ngInject";

    $log = $log.getInstance( "changeLanguageController" );

    this.name = 'changeLanguage';

    this.changeLang = function(iLang) {
      $log.log("Change language to " + iLang);
      $translate.use(iLang);
    }
  }
}

export default changeLanguageController;

