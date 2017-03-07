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
.name;

export default constantModule;
