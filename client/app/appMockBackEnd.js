/* eslint-disable camelcase */
/* eslint-disable angular/timeout-service */
/* eslint-disable no-undef */

// External Module
import angular from 'angular';
import 'angular-mocks/ngMockE2E';

import App from './app';
import ResourceFactory from 'common/resourceFactory/resource';
import UserData from 'common/userDataFactory/userData';


// This module is for local dev only, if we choose this file as the entry point, it will include ngMockE2E,
// including this module will intercept all HTTP requests, this allow working in standalone on the client side
// All the 'fake' http response should be here

angular.module( 'appMockBackEnd', [
  App,
  ResourceFactory,
  UserData,
  'ngMockE2E'
])
.config( ($provide) => {
  'ngInject';

  // Time in ms to simulate a delay in back end response
  let DELAY_HTTP_RESPONSE_TIME = 0;

  $provide.decorator('$httpBackend', ($delegate) => {
    let proxy = function(method, url, data, callback, headers) {
      let interceptor = function() {
        let self = this;
        let _arguments = arguments;
        setTimeout(() => {
          callback.apply(self, _arguments);
        }, DELAY_HTTP_RESPONSE_TIME);
      };
      return $delegate.call(this, method, url, data, interceptor, headers);
    };
    for ( let key in $delegate ) {
      if ( $delegate.hasOwnProperty(key) ) {
        proxy[key] = $delegate[key];
      }
    }
    return proxy;
  });
})
.run( ($log, $httpBackend, $timeout, User, Data, JwtFactory) => {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('appMockBackEnd::RUN');


  $httpBackend.whenGET(/(.*)\.mp4/).passThrough();
  $httpBackend.whenGET(/(.*)\.jpg/).passThrough();
  $httpBackend.whenPOST(/https:\/\/www\.viacharacter\.org\/survey\/api1\/(.*)/).passThrough();

  let menu = require('./mockBackEndResponse/menu-1.json');

  let authenticate = require('./mockBackEndResponse/authenticateResponse.json');
  let participant = require('./mockBackEndResponse/participants.json');

  let stepContent = {};

  let errorReply = [ 401, { error: 'token_not_provided' }, {} ];

  // Trick to be able to build the good regexp to match the incomming query as Data.buildApiUrl('menu', true) uses the ID of the current user
  User.setUser({ id: authenticate.user.id });

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

    $log.log(`getStepContent - iFullUrl=${iFullUrl}  fileName=${fileName}`);
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

    let cycle1 = menu.menudata[0].children[0];
    // let cycle2 = menu.menudata[0].children[1];
    let cycle3 = menu.menudata[0].children[2];
    let C3_module31 = cycle3.children[0];

    let C3_M31_step8_1 = C3_module31.children[7];
    let C3_M31_step8_2 = C3_module31.children[8];
    let C3_M31_step8_3 = C3_module31.children[9];
    let C3_M31_step9 = C3_module31.children[10];

    if ( iFullUrlStepCompleted === '/potentialife-course/cycle-1/module-1/step-9' ) {

      // Update menudata
      cycle1.progress.completed += 1;
      cycle1.progress.percent = 10;

      let module1 = cycle1.children[1];
      let step9 = module1.children[8];
      step9.status = 'completed';
      let step10 = module1.children[9];
      step10.status = 'current';

      // Update Current Step
      menu.current_progression.current_step = step10;

      // Update Step data to say completed for step 1
      updateStepStatus('/potentialife-course/cycle-1/module-1/step-9', 'completed');

      // Update Step data to say current for step 2
      updateStepStatus('/potentialife-course/cycle-1/module-1/step-10', 'current');
    }
    else if ( iFullUrlStepCompleted === '/potentialife-course/cycle-3/module-31/step-8/1' ) {
      C3_M31_step8_1.status = 'completed';
      C3_M31_step8_2.status = 'current';

      updateStepStatus('/potentialife-course/cycle-3/module-31/step-8/1', 'completed');
      updateStepStatus('/potentialife-course/cycle-3/module-31/step-8/2', 'current');
    }
    else if ( iFullUrlStepCompleted === '/potentialife-course/cycle-3/module-31/step-8/2' ) {
      C3_M31_step8_2.status = 'completed';
      C3_M31_step8_3.status = 'current';

      updateStepStatus('/potentialife-course/cycle-3/module-31/step-8/2', 'completed');
      updateStepStatus('/potentialife-course/cycle-3/module-31/step-8/3', 'current');
    }
    else if ( iFullUrlStepCompleted === '/potentialife-course/cycle-3/module-31/step-8/3' ) {
      C3_M31_step8_3.status = 'completed';
      C3_M31_step9.status = 'current';
      updateStepStatus('/potentialife-course/cycle-3/module-31/step-8/3', 'completed');
      updateStepStatus('/potentialife-course/cycle-3/module-31/step-9', 'current');
    }

    $log.log('Fake menu object updated to set cycle1/module1/step10 as current step and step9 as completed');
  };

  let regexpStep = new RegExp('https:\/\/apipl.ciprianspiridon.com\/v1\/step\?.*');
  $httpBackend.whenGET(regexpStep).respond( (method, url) => {

    $log.log(`$httpBackend.whenGET(${url})`);

    if ( !JwtFactory.isAuthedExpired() ) {
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
    }

    return errorReply;
  });

  $httpBackend.whenGET(Data.buildApiUrl('reflexion')).respond( (method, url) => {
    $log.log(`$httpBackend.whenGET(${url})`);

    if ( !JwtFactory.isAuthedExpired() ) {
      let reflexionParticipant = require('./mockBackEndResponse/reflexion.json');
      return [ 200, reflexionParticipant, {} ];
    }

    // Return error by default
    return errorReply;
  });

  $httpBackend.whenGET(Data.buildApiUrl('menu', true)).respond( (method, url, data, headers) => {
    $log.log(`$httpBackend.whenGET(${url}),  method=${method},   data=${data},   headers=${headers}`);

    if ( !JwtFactory.isAuthedExpired() ) {
      // Simulate the menu for a user that is logged in
      return [ 200, menu, {} ];
    }

    // Return error by default
    return errorReply;
  });

  $httpBackend.whenPOST(Data.buildApiUrl('program_data')).respond( (method, url, data, headers) => {
    $log.log(`$httpBackend.whenGET(${url}),  method=${method},   data=`, data, '  headers=', headers);

    let dataObject = angular.fromJson(data);

    if ( !JwtFactory.isAuthedExpired() ) {
      // Simulate a good answer

      updateMenu(dataObject.fullUrl);

      let responseHeaders = {
        stepId: dataObject.stepId,
        status: 'ok'
      };

      let responseContent = {
        congrats: '<p>Congratulations for finishing this module, you\'re a star<\/p>'
      };

      return [ 200, responseContent, responseHeaders ];
    }

    // If the user is not logged in, returns error
    return errorReply;
    // return [ 404, { error: 'token_not_provided' }, {} ]; // switch with the line above if you want to simulate an other error than "Not logged in"

  });

  $httpBackend.whenPOST(Data.buildApiUrl('authenticate')).respond( (method, url, data, headers) => {
    $log.log(`MOCK BackEnd Response. Url=${url},  method=${method},   data=${data},   headers=${headers}`);

    let responseHeaders = {
      status: 'ok'
    };

    return [ 200, authenticate, responseHeaders ];
  });

  $httpBackend.whenPOST(Data.buildApiUrl('password/email')).respond( (method, url) => {
    $log.log(`$httpBackend.whenPOST(${url}),  method=${method}`);

    return [ 200, {}, {} ];
  });

  $httpBackend.whenPOST(Data.buildApiUrl('password/reset')).respond( (method, url, data) => {
    $log.log(`$httpBackend.whenPOST(${url}),  method=${method}`);

    let dataObject = angular.fromJson(data);

    if ( dataObject.hasOwnProperty('token') && dataObject.hasOwnProperty('password') ) {
      return [ 200, authenticate, {} ];
    }

    // If token or user_id is not provided, simulate that the server will returns an error
    return [ 400, { error: 'token_not_provided' }, {} ];
  });


  $httpBackend.whenGET(Data.buildApiUrl('participants', true)).respond( (method, url) => {
    $log.log(`$httpBackend.whenGET(${url}),  method=${method}`);


    return [ 200, participant, {} ];
  });

});
