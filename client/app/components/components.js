import angular from 'angular';
import Home from './home/home';
import About from './about/about';
import Login from './login/login';
import PageNotFound from './pageNotFound/pageNotFound';
import LockedPage from './lockedPage/lockedPage';
import CourseContent from './courseContent/courseContent';

let componentModule = angular.module('app.components', [
  Home,
  About,
  Login,
  PageNotFound,
  LockedPage,
  CourseContent
])

.name;

export default componentModule;
