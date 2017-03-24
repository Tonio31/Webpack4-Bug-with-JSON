import angular from 'angular';
import uiRouter from 'angular-ui-router';
import courseContentComponent from './courseContent.component';
import LogDecorator from 'common/logDecorator/logDecorator';
import UserDataFactory from 'common/userDataFactory/userData';
import ResourceFactory from 'common/resourceFactory/resource';
import MenuService from 'common/menuFactory/menu';
import videoModule from 'components/videoModule/videoModule';
import textAreaModule from 'components/textArea/textArea';
import textBoxModule from 'components/textBox/textBox';
import iconTextModule from 'components/iconText/iconText';
import barChartModule from 'components/barChart/barChart';
import checkbox from 'components/checkbox/checkbox';
import radioList from 'components/radioList/radioList';
import constantModule from 'common/constants';
import filtersModule from 'common/filters/filters';
import unorderedList from 'components/unorderedList/unorderedList';
import composed from 'components/composed/composed';


let courseContentModule = angular.module('courseContent', [
  uiRouter,
  UserDataFactory,
  ResourceFactory,
  MenuService,
  videoModule,
  textAreaModule,
  textBoxModule,
  iconTextModule,
  barChartModule,
  checkbox,
  radioList,
  constantModule,
  composed,
  filtersModule,
  unorderedList,
  LogDecorator
])
  .component('courseContent', courseContentComponent)
  .name;

export default courseContentModule;
