import angular from 'angular';
import Navbar from './navbar/navbar';
import ChangeLanguage from './changeLanguage/changeLanguage';
import Hero from './hero/hero';
import User from './user/user';

let commonModule = angular.module('app.common', [
  Navbar,
  ChangeLanguage,
  Hero,
  User
])

.name;

export default commonModule;
