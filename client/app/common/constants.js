import angular from 'angular';

let constantModule = angular.module('app.common.constant', [
])
  .constant( 'TOKEN', 'token' )
  .constant( 'USER_ID', 'user_id' )
  .constant( 'STATES', {
    HOME: '/home',
    LOGIN: '/login',
    PAGE_NOT_FOUND: '/404'
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
    WARNING: 'w',
    LOCK: 'l'
  })
.name;

export default constantModule;
