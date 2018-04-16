import angular from 'angular';
import Navbar from './navbar/navbar';
import Footer from './footer/footer';
import CompanyBanner from './companyBanner/companyBanner';
import ChangeLanguage from './changeLanguage/changeLanguage';
import ResourceFactory from './resourceFactory/resource';
import ZendeskWidgetFactory from './zendeskWidget/zendeskWidget';
import UserDataFactory from './userDataFactory/userData';
import JwtFactory from './jwtFactory/jwt';
import BugsnagModule from './bugsnag/bugsnag';
import ExceptionOverwriteModule from './exceptionOverwrite/exceptionOverwrite';
import MenuService from './menuFactory/menu';
import LoadingSpinner from './loadingSpinner/loadingSpinner';
import TransitionsHandlerModule from './transitionsHandler/transitionsHandler';
import LogDecorator from './logDecorator/logDecorator';
import ConstantModule from './constants';

let commonModule = angular.module('app.common', [
  Navbar,
  Footer,
  CompanyBanner,
  ChangeLanguage,
  LogDecorator,
  ResourceFactory,
  MenuService,
  LoadingSpinner,
  JwtFactory,
  UserDataFactory,
  ZendeskWidgetFactory,
  BugsnagModule,
  ExceptionOverwriteModule,
  TransitionsHandlerModule,
  ConstantModule
])
.name;

export default commonModule;
