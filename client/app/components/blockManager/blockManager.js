import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import LogDecorator from 'common/logDecorator/logDecorator';
import blockManagerComponent from './blockManager.component';
import constantModule from 'common/constants';
import audioModule from 'components/audioModule/audioModule';
import videoModule from 'components/videoModule/videoModule';
import buttonModule from 'components/buttonModule/buttonModule';
import textAreaModule from 'components/textArea/textArea';
import textBoxModule from 'components/textBox/textBox';
import iconTextModule from 'components/iconText/iconText';
import barChartModule from 'components/barChart/barChart';
import pieChartModule from 'components/pieChart/pieChart';
import gaugeChartModule from 'components/gaugeChart/gaugeChart';
import spiderChartModule from 'components/spiderChart/spiderChart';
import lineChartModule from 'components/lineChart/lineChart';
import wordCloudModule from 'components/wordCloud/wordCloud';
import checkbox from 'components/checkbox/checkbox';
import radioList from 'components/radioList/radioList';
import unorderedList from 'components/unorderedList/unorderedList';
import composed from 'components/composed/composed';
import htmlModule from 'components/htmlModule/htmlModule';
import viaSurvey from 'components/viaSurvey/viaSurvey';


let blockManagerModule = angular.module('blockManager', [
  uiRouter,
  LogDecorator,
  constantModule,
  videoModule,
  audioModule,
  buttonModule,
  textAreaModule,
  textBoxModule,
  iconTextModule,
  barChartModule,
  pieChartModule,
  gaugeChartModule,
  spiderChartModule,
  lineChartModule,
  wordCloudModule,
  checkbox,
  radioList,
  unorderedList,
  composed,
  htmlModule,
  viaSurvey
])

.component('blockManager', blockManagerComponent)

.name;

export default blockManagerModule;
