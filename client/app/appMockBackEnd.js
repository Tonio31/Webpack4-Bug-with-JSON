/* eslint-disable camelcase */

// External Module
import angular from 'angular';
import 'angular-mocks/ngMockE2E';

import App from './app';
import ResourceFactory from 'common/resourceFactory/resource';


// This module is for local dev only, if we choose this file as the entry point, it will include ngMockE2E,
// including this module will intercept all HTTP requests, this allow working in standalone on the client side
// All the 'fake' http response should be here

angular.module( 'appMockBackEnd', [
  App,
  ResourceFactory,
  'ngMockE2E'
])
.run( ($log, $httpBackend, Data) => {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('appMockBackEnd::RUN');


  $httpBackend.whenGET(/(.*)\.mp4/).passThrough();
  $httpBackend.whenGET(/(.*)\.jpg/).passThrough();

  let menu = require('./mockBackEndResponse/menu-1.json');

  let authenticate = require('./mockBackEndResponse/authenticateResponse.json');

  let stepContent = {};

  // will take an URL and return a file name
  // iFullUrlToServer: http://apipl.ciprianspiridon.com/v1/step?slug=%2Fpotentialife-course%2Fcycle-1%2Fmodule-1%2Fstep-1
  // return:  potentialife-course_cycle-1_module-1_step-1
  let getFileNameFromUrlOptions = (iFullUrlToServer) => {

    let optionalParams = iFullUrlToServer.substring(iFullUrlToServer.indexOf('%2F') + '%2F'.length);
    let fileName = optionalParams.replace(/%2F/g, '_');

    return fileName;
  };

  let getStepContent = (iFullUrl) => {

    let fileName = getFileNameFromUrlOptions(iFullUrl);

    if ( !stepContent.hasOwnProperty(fileName) ) {
      stepContent[fileName] = require(`./mockBackEndResponse/${fileName}.json`);
    }

    return stepContent[fileName];
  };

  let updateStepStatus = (iFullUrl, iNewStatus) => {

    let fileName = iFullUrl.substring(1).replace(/\//g, '_');

    if ( !stepContent.hasOwnProperty(fileName) ) {

      stepContent[fileName] = require(`./mockBackEndResponse/${fileName}.json`);
    }

    stepContent[fileName].status = iNewStatus;
  };


  // This function will update the current step on the menu, it is harcoded to simulate the fact that the backend will do this job
  let updateMenu = (iFullUrlStepCompleted) => {

    if ( iFullUrlStepCompleted === '/potentialife-course/cycle-1/module-1/step-1' ) {

      // Update menudata
      let cycle1 = menu.menudata[0].children[0];
      cycle1.progress.completed += 1;
      cycle1.progress.percent = 10;

      let module1 = cycle1.children[1];
      let step1 = module1.children[0];
      step1.status = 'completed';
      let step2 = module1.children[1];
      step2.status = 'current';

      // Update Current Step
      menu.current_progression.current_step = step2;

      // Update Step data to say completed for step 1
      updateStepStatus('/potentialife-course/cycle-1/module-1/step-1', 'completed');

      // Update Step data to say current for step 2
      updateStepStatus('/potentialife-course/cycle-1/module-1/step-2', 'current');
    }

    $log.log('Fake menu object updated to set cycle1/module1/step8 as current step and step7 as completed');
  };

  let regexpStep = new RegExp('http:\/\/apipl.ciprianspiridon.com\/v1\/step\?.*');
  $httpBackend.whenGET(regexpStep).respond( (method, url) => {

    $log.log(`$httpBackend.whenGET(${url})`);

    let content = {};
    try {
      content = getStepContent(url);
    }
    catch (error) {
      $log.log(error);
      if ( error.message.includes('Cannot find module') ) {
        // The json for this step is not yet imported in the project return the generic content
        $log.log('No json found for the specific step, returning generic content');
        content = require('./mockBackEndResponse/genericContent.json');
      }
    }

    return [ 200, content, {} ];
  });

  $httpBackend.whenGET(Data.buildApiUrl('reflexion')).respond( (method, url) => {
    $log.log(`$httpBackend.whenGET(${url})`);

    let reflexionParticipant = require('./mockBackEndResponse/reflexion.json');
    return [ 200, reflexionParticipant, {} ];
  });

  $httpBackend.whenGET(Data.buildApiUrl('menu')).respond( (method, url) => {
    $log.log('Data(menu)=', Data.buildApiUrl('menu'));

    $log.log(`MOCK BackEnd Response. Url=${url},  method=${method}`);

    return [ 200, menu, {} ];
  });

  $httpBackend.whenPOST(Data.buildApiUrl('step')).respond( (method, url, data, headers) => {
    $log.log(`MOCK BackEnd Response. Url=${url},  method=${method},   data=${data},   headers=${headers}`);

    let dataObject = angular.fromJson(data);

    updateMenu(dataObject.fullUrl);

    let responseHeaders = {
      stepId: dataObject.stepId,
      status: 'ok'
    };

    return [ 200, { nextStepFullSlug: 'someData' }, responseHeaders ];
  });

  $httpBackend.whenPOST(Data.buildApiUrl('authenticate')).respond( (method, url, data, headers) => {
    $log.log(`MOCK BackEnd Response. Url=${url},  method=${method},   data=${data},   headers=${headers}`);

    let responseHeaders = {
      status: 'ok'
    };

    return [ 200, authenticate, responseHeaders ];
  });


  $httpBackend.whenGET(/\/users\/\d+/).respond( (method, url) => {
    // parse the matching URL to pull out the id (/games/:id)
    let userid = url.split('/')[2];
    $log.log(`userid=${userid}`);
    let user = {
      name: 'Mock Reply',
      userid: userid
    };
    return [ 200, user, {} ];
  });

});
