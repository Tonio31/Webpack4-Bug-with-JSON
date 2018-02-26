import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import videoComponent from './videoModule.component';
import LogDecorator from 'common/logDecorator/logDecorator';
import UtilityFactory from 'common/utility/utility';
import 'video.js/dist/video-js.css';
import 'videojs-resolution-switcher/lib/videojs-resolution-switcher.css';
import 'vjs-video';
import 'videojs-resolution-switcher';

let videoModule = angular.module('videoModule', [
  uiRouter,
  LogDecorator,
  UtilityFactory,
  'vjs.video'
])

.component('videoModule', videoComponent)

.name;

export default videoModule;
