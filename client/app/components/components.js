import angular from 'angular';
import Home from './home/home';
import Main from './main/main';
import About from './about/about';
import Login from './login/login';
import retrieveCredentials from './retrieveCredentials/retrieveCredentials';
import resetPassword from './resetPassword/resetPassword';
import LoginRoot from './loginRoot/loginRoot';
import PageNotFound from './pageNotFound/pageNotFound';
import LockedPage from './lockedPage/lockedPage';
import CourseContent from './courseContent/courseContent';

let componentModule = angular.module('app.components', [
  Home,
  Main,
  About,
  Login,
  retrieveCredentials,
  resetPassword,
  LoginRoot,
  PageNotFound,
  LockedPage,
  CourseContent
])

.name;

export default componentModule;
