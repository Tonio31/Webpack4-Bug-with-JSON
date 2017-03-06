import angular from 'angular';
import Home from './home/home';
import About from './about/about';
import Login from './login/login';
import PageNotFound from './pageNotFound/pageNotFound';
import CourseContent from './courseContent/courseContent';

let componentModule = angular.module('app.components', [
  Home,
  About,
  Login,
  PageNotFound,
  CourseContent
])

.name;

export default componentModule;
