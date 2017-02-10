class changeLanguageController {
  constructor($log, $translate) {
    "ngInject";
    this.name = 'changeLanguage';

    this.changeLang = function(iLang) {
      $log.log("Change language to " + iLang);
      $translate.use(iLang);
    }
  }
}

export default changeLanguageController;

