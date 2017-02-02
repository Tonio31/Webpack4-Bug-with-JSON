class changeLanguageController {
  constructor($translate) {
    "ngInject";
    this.name = 'changeLanguage';

    this.changeLang = function(iLang) {
      console.log("Change language to " + iLang);
      $translate.use(iLang);
    }
  }
}

export default changeLanguageController;

