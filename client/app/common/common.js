import angular from 'angular';
import Navbar from './navbar/navbar';
import ChangeLanguage from './changeLanguage/changeLanguage';
import Hero from './hero/hero';
import RessourceFactory from './resourceService/resource';
import UserDataFactory from './userDataFactory/userData';
import MenuService from './menuService/menu';

let commonModule = angular.module('app.common', [
  Navbar,
  ChangeLanguage,
  Hero,
  RessourceFactory,
  MenuService,
  UserDataFactory
])
.name;

export default commonModule;
