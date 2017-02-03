import angular from 'angular';
import Navbar from './navbar/navbar';
import ChangeLanguage from './changeLanguage/changeLanguage';
import Hero from './hero/hero';
import RessourceFactory from './resourceService/resource';
import UserDataFactory from './userDataFactory/userData';
require('lodash/core');

let commonModule = angular.module('app.common', [
  Navbar,
  ChangeLanguage,
  Hero,
  RessourceFactory,
  UserDataFactory
])
.factory('_', function( $window ) {
  "ngInject";
  var _ = $window._;

  //Remove the global variable, so it is not possible ot use it by mistake (you have to inject it)
  delete( $window._ );
  return ( _ );
})
.name;

export default commonModule;
