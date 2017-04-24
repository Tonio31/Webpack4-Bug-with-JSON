import angular from 'angular';

let constantModule = angular.module('app.common.constant', [
])
  .constant( 'TOKEN', 'token' )
  .constant( 'USER_ID', 'user_id' )
  .constant( 'STATES', {
    MAIN: 'main',
    MAIN_NO_MENU: 'main_no_menu',
    LOGIN_ROOT: 'loginRoot',
    HOME: '/home',
    LOGIN: '/login',
    RESET_PASSWORD: '/password/reset',
    RETRIEVE_CREDENTIALS: '/retrieve_credentials',
    PAGE_NOT_FOUND: '/404',
    SURVEY: '/360_Survey'
  })
  .constant('FORM_NAME_PREFIX', 'myForm')
  .constant('MODEL_OPTIONS', {
    updateOn: 'default blur',
    debounce: {
      default: 500,
      blur: 0
    }
  })
  .constant('ICON_FONTELLO', {
    VALID_TICK: 't',
    WARNING: '!',
    LOCK: 'l',
    EYE: 'e',
    ARROW_RIGHT: '>',
    ARROW_LEFT: '<',
    PDF_ICON: 'p',
    PL_ICON: 'u',
    TIME_REFLECT: 'R',
    SELF_DISCOVERY: 'D',
    STRENGTHS: 's',
    LIFE_MAP: 'M',
  })
  .constant('SPINNERS', {
    COURSE_CONTENT: 'courseContentSpinner',
    TOP_LEVEL: 'topLevelSpinner',
    SAVING_STEP: 'savingStepSpinner'
  })
  .constant('APIS_URL', {
    apiUrl: BACK_END_API,
    apiViaSurvey: 'https://www.viacharacter.org/survey/api1/'
  })
.name;

export default constantModule;
