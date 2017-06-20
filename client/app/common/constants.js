import angular from 'angular';

let constantModule = angular.module('app.common.constant', [
])
  .constant( 'TOKEN', 'token' )
  .constant( 'USER_ID', 'user_id' )
  .constant( 'TOKEN_SURVEY', 'token_survey' )
  .constant( 'STATES', {
    MAIN: 'main',
    MAIN_NO_MENU: 'main_no_menu',
    LOGIN_ROOT: 'loginRoot',
    HOME: '/home',
    LOGIN: '/login',
    RESET_PASSWORD: '/password/reset',
    RETRIEVE_CREDENTIALS: '/retrieve_credentials',
    PAGE_NOT_FOUND: '/404',
    PAGE_NOT_FOUND_NO_MENU: '/PageNotFound', // This needs to be different than PAGE_NOT_FOUND
    ERROR_PAGE: '/Error',
    ERROR_PAGE_NO_MENU: '/UnexpectedError', // This needs to be different than ERROR_PAGE
    SURVEY: '/360-Survey'
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
  .constant('WEBSITE_CONFIG', {
    apiUrl: BACK_END_API,
    googleTrackingCode: GOOGLE_TRACKING_CODE,
    GA_DIMENSIONS: {
      COMPANY: 'dimension1',
      COHORT: 'dimension2',
      DIVISION: 'dimension3'
    },
    brochureWebSite: {
      homePageUrl: BROCHURE_HOME_URL
    },
    viaSurvey: {
      api: 'https://www.viacharacter.org/survey/api1/',
      appKey: VIA_SURVEY_APP_KEY,
      surveyID: 86,
      questionCount: 120
    },
    OTHER_PL_SITES_API: {
      api: {
        checkUsernameApi: 'local.check_username_email',
        checkCredentialsApi: 'local.check_credentials',
        resetPasswordApi: 'reset_pass_curl',
      },
      change: {
        apiUrl: `${BACK_END_API}/check-auth/change`,
        loginUrl: 'http://change.potentialife.com/wp-login.php'
      },
      my: {
        apiUrl: 'https://my.potentialife.com/api/index_v2.php',
        loginUrl: 'https://my.potentialife.com/wp-login.php'
      },
    }
  })
.name;

export default constantModule;
