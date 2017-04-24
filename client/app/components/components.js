import angular from 'angular';
import Home from './home/home';
import Main from './main/main';
import FriendsSurvey from './friendsSurvey/friendsSurvey';
import About from './about/about';
import Login from './login/login';
import retrieveCredentials from './retrieveCredentials/retrieveCredentials';
import resetPassword from './resetPassword/resetPassword';
import LoginRoot from './loginRoot/loginRoot';
import moduleOverview from './moduleOverview/moduleOverview';
import PageNotFound from './pageNotFound/pageNotFound';
import LockedPage from './lockedPage/lockedPage';
import CourseContent from './courseContent/courseContent';

let componentModule = angular.module('app.components', [
  Home,
  Main,
  FriendsSurvey,
  About,
  Login,
  retrieveCredentials,
  resetPassword,
  LoginRoot,
  moduleOverview,
  PageNotFound,
  LockedPage,
  CourseContent
])

.name;

export default componentModule;
