import angular from 'angular';
import uiRouter from 'angular-ui-router';
import LogDecorator from 'common/logDecorator/logDecorator';
import blockManagerComponent from './blockManager.component';
import constantModule from 'common/constants';
import videoModule from 'components/videoModule/videoModule';
import buttonModule from 'components/buttonModule/buttonModule';
import textAreaModule from 'components/textArea/textArea';
import textBoxModule from 'components/textBox/textBox';
import iconTextModule from 'components/iconText/iconText';
import barChartModule from 'components/barChart/barChart';
import checkbox from 'components/checkbox/checkbox';
import radioList from 'components/radioList/radioList';
import unorderedList from 'components/unorderedList/unorderedList';
import composed from 'components/composed/composed';
import htmlModule from 'components/htmlModule/htmlModule';


let blockManagerModule = angular.module('blockManager', [
  uiRouter,
  LogDecorator,
  constantModule,
  videoModule,
  buttonModule,
  textAreaModule,
  textBoxModule,
  iconTextModule,
  barChartModule,
  checkbox,
  radioList,
  unorderedList,
  composed,
  htmlModule
])

.component('blockManager', blockManagerComponent)

.name;

export default blockManagerModule;