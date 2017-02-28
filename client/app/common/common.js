import angular from 'angular';
import Navbar from './navbar/navbar';
import Footer from './footer/footer';
import ChangeLanguage from './changeLanguage/changeLanguage';
import ResourceFactory from './resourceFactory/resource';
import UserDataFactory from './userDataFactory/userData';
import JwtFactory from './jwtFactory/jwt';
import MenuService from './menuFactory/menu';
import LogDecorator from './logDecorator/logDecorator';

let commonModule = angular.module('app.common', [
  Navbar,
  Footer,
  ChangeLanguage,
  LogDecorator,
  ResourceFactory,
  MenuService,
  JwtFactory,
  UserDataFactory
])
.name;

export default commonModule;
