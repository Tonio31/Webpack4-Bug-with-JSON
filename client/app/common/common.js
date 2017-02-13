import angular from 'angular';
import Navbar from './navbar/navbar';
import ChangeLanguage from './changeLanguage/changeLanguage';
import Hero from './hero/hero';
import ResourceFactory from './resourceFactory/resource';
import UserDataFactory from './userDataFactory/userData';
import MenuService from './menuFactory/menu';
import LogDecorator from './logDecorator/logDecorator';

let commonModule = angular.module('app.common', [
  Navbar,
  ChangeLanguage,
  Hero,
  LogDecorator,
  ResourceFactory,
  MenuService,
  UserDataFactory
])
.name;

export default commonModule;
