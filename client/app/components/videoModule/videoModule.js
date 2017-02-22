import angular from 'angular';
import uiRouter from 'angular-ui-router';
import videoComponent from './videoModule.component';
import LogDecorator from 'common/logDecorator/logDecorator';
import 'video.js/dist/video-js.css';
import 'vjs-video';

let videoModule = angular.module('videoModule', [
  uiRouter,
  LogDecorator,
  'vjs.video'
])

.component('videoModule', videoComponent)

.name;

export default videoModule;
