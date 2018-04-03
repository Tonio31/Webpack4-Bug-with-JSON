let LanguageFactory = function($log, $translate) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance( 'ChangeLanguageFactory' );

  let viaSurveyLanguage = {
    en: 'en-us'
  };

  let getCurrentLanguage = () => {
    let currentLanguage = $translate.use() || $translate.proposedLanguage();

    $log.log( 'getCurrentLanguage() currentLanguage=', currentLanguage,
      '   $translate.use()=', $translate.use(),
      '   $translate.proposedLanguage()=', $translate.proposedLanguage() );

    return currentLanguage;
  };

  let getCurrentLanguageForViaSurvey = () => {
    let currentLanguage = getCurrentLanguage();

    if ( viaSurveyLanguage.hasOwnProperty(currentLanguage) ) {
      return viaSurveyLanguage[currentLanguage];
    }

    $log.warn(`No equivalent for ViaSurvey language for ${currentLanguage}, using default language: ${viaSurveyLanguage.en}`);
    return viaSurveyLanguage.en;
  };


  return {
    getCurrentLanguage,
    getCurrentLanguageForViaSurvey
  };

};

export default LanguageFactory;
