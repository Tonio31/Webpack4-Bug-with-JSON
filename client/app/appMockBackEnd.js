/* eslint-disable camelcase */
/* eslint-disable angular/timeout-service */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

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

  const ID_FIRST_USER = '4';
  const ID_STEP_2 = '129';


  let menu = {
    [ID_FIRST_USER]: require(`./mockBackEndResponse/${ID_FIRST_USER}/menu.json`),
    [ID_STEP_2]: require(`./mockBackEndResponse/${ID_STEP_2}/menu.json`)
  };

  let authenticate = {
    [ID_FIRST_USER]: require(`./mockBackEndResponse/${ID_FIRST_USER}/authenticate.json`),
    [ID_STEP_2]: require(`./mockBackEndResponse/${ID_STEP_2}/authenticate.json`)
  };
  let participant = {
    [ID_FIRST_USER]: require(`./mockBackEndResponse/${ID_FIRST_USER}/participants.json`),
    [ID_STEP_2]: require(`./mockBackEndResponse/${ID_STEP_2}/participants.json`)
  };

  let stepContent = {
    [ID_FIRST_USER] : {},
    [ID_STEP_2] : {}
  };

  let error401 = [ 401, { message: 'token_not_provided' }, {}, 'token_not_provided' ];
  let error401_tokenExpired = [ 401, { message: 'token_expired' }, {}, 'token_expired' ];
  let error401_tokenUsed = [ 401, { message: 'token_used' }, {}, 'token_used' ];
  let error429 = [ 429, { message: 'too_many_invalid_credentials' }, {}, 'too_many_invalid_credentials' ];
  let error500 = [ 500, { message: 'Internal Server Error' }, {} ]; // eslint-disable-line no-unused-vars

  // Set a userID by default if the user logs in with a token in the URL
  if ( !JwtFactory.getUserId() ) {
    $log.warn('No userID stored in Local Storage, use userId=4 by default');
    JwtFactory.saveUserId(4);
  }

  // will take an URL and return a file name
  // iFullUrlToServer: "https://localhost.com/step?slug=%5C%2Fpotentialife-course%5C%2Fcycle-1%5C%2Fmodule-1%5C%2Fstep-3"
  // return:  potentialife-course_cycle-1_module-1_step-1
  let getFileNameFromUrlOptions = (iFullUrlToServer) => {

    // let optionalParams = iFullUrlToServer.substring(iFullUrlToServer.indexOf('%5C%2F') + '%5C%2F'.length);
    // let fileName = optionalParams.replace(/%5C%2F/g, '_');
    let optionalParams = iFullUrlToServer.substring(iFullUrlToServer.indexOf('%2F') + '%2F'.length);
    let fileName = optionalParams.replace(/%2F/g, '_');

    return fileName;
  };

  let getStepContent = (iFullUrl, iUserID) => {

    let fileName = getFileNameFromUrlOptions(iFullUrl);

    $log.log(`getStepContent - iFullUrl=${iFullUrl}  fileName=${fileName}  iUserID=${iUserID}`);
    if ( !stepContent[iUserID].hasOwnProperty(fileName) ) {
      stepContent[iUserID][fileName] = require(`./mockBackEndResponse/${iUserID}/${fileName}.json`);
    }

    return stepContent[iUserID][fileName];
  };

  let updateStepStatus = (iUserId, iFullUrl, iNewStatus) => {
    $log.log(`updateStepStatus() - iUserID=${iUserId}  iFullUrl=${iFullUrl}  iNewStatus=${iNewStatus}`);

    let fileNameCurrentStep = iFullUrl.substring(1).replace(/\//g, '_');

    // Update current step to Completed
    if ( !stepContent[iUserId].hasOwnProperty(fileNameCurrentStep) ) {
      stepContent[iUserId][fileNameCurrentStep] = require(`./mockBackEndResponse/${iUserId}/${fileNameCurrentStep}.json`);
    }
    stepContent[iUserId][fileNameCurrentStep].status = 'completed';

    // Update next step to current
    let nextStepFullUrl = stepContent[iUserId][fileNameCurrentStep].next_page_url;
    if ( nextStepFullUrl !== '/home' ) {
      let fileNameNextStep = nextStepFullUrl.substring(1).replace(/\//g, '_');
      if ( !stepContent[iUserId].hasOwnProperty(fileNameNextStep) ) {
        stepContent[iUserId][fileNameNextStep] = require(`./mockBackEndResponse/${iUserId}/${fileNameNextStep}.json`);
      }
      stepContent[iUserId][fileNameNextStep].status = 'current';
    }

    return nextStepFullUrl;
  };

  let updateMenu = ( iUrlCompletedStep, iFullUrlNextStep, iUserId) => {
    $log.log(`updateMenu() -  iUrlCompletedStep=${iUrlCompletedStep}  iFullUrlNextStep=${iFullUrlNextStep}  iUserID=${iUserId}`);

    let updateStateToCurrent = false;

    for ( let itCycle of menu[iUserId].menudata[0].children ) {

      if ( itCycle.hasOwnProperty('children') ) {
        for ( let itModule of itCycle.children ) {


          if ( itModule.hasOwnProperty('children') ) {
            for ( let itStep of itModule.children ) {
              if (itStep.fullUrl === iUrlCompletedStep) {
                itStep.status = 'completed';
                $log.warn(`Setting Step (${itStep.fullUrl}) to completed`);
                updateStateToCurrent = true;
              }
              else if (itStep.fullUrl === iFullUrlNextStep || updateStateToCurrent) {

                if ( iFullUrlNextStep !== '/home' && !updateStateToCurrent ) {
                  $log.error(`iFullUrlNextStep=${iFullUrlNextStep} - updateStateToCurrent=${updateStateToCurrent}  ||  This should never happens`);
                }

                updateStateToCurrent = false;
                itStep.status = 'current';
                menu[iUserId].current_progression.current_step = itStep;
                $log.warn(`Setting Next Step (${itStep.fullUrl}) to current`);

                // When the nextStep is updated to current, there is no more step to update, it is useless to continue the for loops
                return;
              }
            }
          }
        }
      }
    }
  };


  // This function will update the current step on the menu, it is harcoded to simulate the fact that the backend will do this job
  let updateUserProgression = (iFullUrlStepCompleted, iUserId) => {
    $log.log(`updateUserProgression() - iFullUrlStepCompleted=${iFullUrlStepCompleted}  iUserID=${iUserId}`);


    let nextStepFullUrl = updateStepStatus(iUserId, iFullUrlStepCompleted);
    updateMenu(iFullUrlStepCompleted, nextStepFullUrl, iUserId);
  };

  let regexpStep = new RegExp('https:\/\/localhost\.com\/step\?.*');
  $httpBackend.whenGET(regexpStep).respond( (method, url, data, headers) => {

    $log.log(`$httpBackend.whenGET(${url}),  method=${method},   data=`, data, '  headers=', headers);


    // Simulate an Internal server error
    // return error500;

    if ( !JwtFactory.isAuthExpired() ) {
      let content = {};
      try {
        content = getStepContent(url, headers.user_id);
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

    return error401;
  });


  // **************************************************************************************************** //
  //                                   API END POINTS                                                     //

  $httpBackend.whenGET(Data.buildApiUrl('reflexion')).respond( (method, url, data, headers) => {
    $log.log(`$httpBackend.whenGET(${url}),  method=${method},   data=`, data, '  headers=', headers);

    // Simulate an Internal server error
//    return error500;

    if ( !JwtFactory.isAuthExpired() ) {
      let reflexion = require(`./mockBackEndResponse/${headers.user_id}/reflexion.json`);
      return [ 200, reflexion, {} ];
    }

    // Return error by default
    return error401;
  });

  let regexpSurvey = new RegExp('https:\/\/localhost\.com\/survey\?.*');
  $httpBackend.whenGET(regexpSurvey).respond( (method, url) => {
    $log.log(`$httpBackend.whenGET(${url})`);

    // find the page number and token_survey
    let regexp = new RegExp('^.*page=(\\d)(?:&token_survey=(.*))?');

    let groups = url.match(regexp);
    $log.log('groups=', groups);
    let pageNumber = groups[1];
    let tokenSurvey = groups[2];

    if ( angular.isUndefined(tokenSurvey) ) {
      return error401_tokenUsed;
    }

    let survey = require(`./mockBackEndResponse/360_survey_page_${pageNumber}.json`);

    return [ 200, survey, {} ];
  });

  $httpBackend.whenGET(new RegExp(`${Data.buildApiUrl('menu')}(.*)`)).respond( (method, url, data, headers) => {
    $log.log(`$httpBackend.whenGET(${url}),  method=${method},   data=`, data, '  headers=', headers);

    if ( !JwtFactory.isAuthExpired() ) {

      // Simulate the menu for a user that is logged in
      return [ 200, menu[headers.user_id], {} ];
    }

    // Return error by default
    return error401;
  });

  $httpBackend.whenGET(new RegExp(`LifeActsPdf(.*)`)).respond( (method, url, data, headers, params) => {
    $log.log(`$httpBackend.whenGET(${url}),  method=${method},   data=`, data, '  headers=', headers, '  params=', params);

    let fileName = url.replace(/\//g, '_');

    let fullName = `/mockBackEndResponse/lifeActsPdf/${fileName}.json`;
    let lifeActPDF = {};
    if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-1.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-1.json');
    }
    else if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-2.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-2.json');
    }
    else if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-3.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-3.json');
    }
    else if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-4.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-4.json');
    }
    else if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-5.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-5.json');
    }
    else if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-6.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-6.json');
    }
    else if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-7.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-7.json');
    }
    else if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-8.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-8.json');
    }
    else if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-9.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-9.json');
    }
    else if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-10.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-10.json');
    }
    else if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-11-playbook.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-11-playbook.json');
    }
    else if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-2_module-1.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-2_module-1.json');
    }
    else if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-2_module-2.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-2_module-2.json');
    }
    else if ( fullName === '/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-2_module-3.json' ) {
      lifeActPDF = require('./mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-2_module-3.json');
    }

    return [ 200, lifeActPDF, {} ];
  });

  // Get ShortCode for specific participant
  $httpBackend.whenGET(new RegExp(`${Data.buildApiUrl('program_data')}(.*)`))
  .respond( (method, url, data, headers, params) => {
    $log.log(`$httpBackend.whenGET(${url}),  method=${method},   data=`, data, '  headers=', headers, '  params=', params);

    let response = {};
    let shortCodeArray = angular.fromJson(params.shortcodes);

    let randomValueForShortCode = [
     // '1 practical \\\\\" \""" \\\'change "saddas\\\"sadsa\' \' \' \"HEBREW מה שלומך END OF HEBREW',
     // "2 \\\\\" \" \\\'2222 \"2222\"2222\' \\' \' \"",
    //  56,
      '\t',
      '\n\n\n',
      "1 practical change saddas\"sadsa' ' ' \" \n\u05de\u05d4 \u05e9\u05dc\u05d5\u05de\u05da",
    //  null
    ];

    for ( let shortCode of shortCodeArray ) {

      if ( shortCode === 'l1.m1.s9.textbox.idea_to_increase_strengths' ) {
        // eslint-disable-next-line max-len
        response[shortCode] = '1234 567890 123 4567 890 1234567891234 567890 123 4567 890 1234567891234567891234 567890 123 4567 890 1234567891234567891234 567890 123 4567 890 1234567891234567891234 567890 123 4567 890 1234567891234567891234 567890 123 4567 890 1234567891234567891234 5dsasadsdasadd';
      }
      else if ( shortCode === 'l1.energized.chosen_activity_1' ) {
        response[shortCode] = null;
      }
      else {
        response[shortCode] = randomValueForShortCode[Math.floor(Math.random() * randomValueForShortCode.length)];
      }
    }

    return [ 200, response, {} ];
  });

  $httpBackend.whenPOST(Data.buildApiUrl('program_data')).respond( (method, url, data, headers) => {
    let dataObject = angular.fromJson(data);
    $log.log(`$httpBackend.whenPOST(${url}),  method=${method},   dataObject=`, dataObject, '  headers=', headers);

    let responseHeaders = {
      stepId: dataObject.stepId,
      status: 'ok'
    };

    let responseContent = {
      congrats: '<p>Congratulations for finishing this step, you\'re a star<\/p>'
    };

    if ( dataObject.hasOwnProperty('fullUrl') && dataObject.fullUrl === 'genericContent' ) {
      return [ 200, responseContent, responseHeaders ];
    }
    else if ( dataObject.hasOwnProperty('markStepAsCompleted') && dataObject.markStepAsCompleted === false ) {
      return error500;
    }
    else if ( !JwtFactory.isAuthExpired() ) {
      // Simulate a good answer

      updateUserProgression(dataObject.fullUrl, headers.user_id);

      return [ 200, responseContent, responseHeaders ];
    }

    // If the user is not logged in, returns error
    return error401_tokenExpired;
  });

  $httpBackend.whenPOST(Data.buildApiUrl('logout')).respond( (method, url, data, headers) => {
    $log.log(`$httpBackend.whenPOST(${url}),  method=${method},   data=`, data, '  headers=', headers);
    return [ 200, {}, {} ];
  });

  $httpBackend.whenPOST(Data.buildApiUrl('authenticate')).respond( (method, url, data, headers) => {
    $log.log(`$httpBackend.whenGET(${url}),  method=${method},   data=`, data, '  headers=', headers);

    // return error429;

    let dataObject = angular.fromJson(data);
    if ( dataObject.email === 'tonio1@gmail.com' ) {
      // Trick to be able to build the good regexp to match the incoming query as Data.buildApiUrl('menu', true) uses the ID of the current user
      User.setUser({ id: authenticate[ID_STEP_2].user.id });
      return [ 200, authenticate[ID_STEP_2], {} ];
    }


    // return error401;
    // Trick to be able to build the good regexp to match the incoming query as Data.buildApiUrl('menu', true) uses the ID of the current user
    User.setUser({ id: authenticate[4].user.id });
    return [ 200, authenticate[4], {} ];
  });

  $httpBackend.whenGET(new RegExp('mockBackEndResponse')).passThrough();
  // $httpBackend.whenGET('/mockBackEndResponse/lifeActsPdf/LifeActsPdf_level-1_module-1.json').passThrough();

  $httpBackend.whenPOST(/http:\/\/change\.potentialife\.com\/api\/(.*)/).passThrough();
  $httpBackend.whenPOST(/https:\/\/my\.potentialife\.com\/api\/(.*)/).passThrough();
  // $httpBackend.whenPOST(/http:\/\/change\.potentialife\.com\/api\/index_v2\.php\?section=local\.check_username_email(.*)/).respond( (method, url, data, headers) => {
  //
  //   let notFound = {
  //     status: 'not_found'
  //   };
  //
  //   return [ 200, notFound, {} ];
  // });

  $httpBackend.whenPOST(Data.buildApiUrl('password/email')).respond( (method, url, data, headers) => {
    $log.log(`$httpBackend.whenGET(${url}),  method=${method},   data=`, data, '  headers=', headers);

    return [ 200, {}, {} ];
  });

  $httpBackend.whenPOST(Data.buildApiUrl('password/reset')).respond( (method, url, data, headers) => {
    $log.log(`$httpBackend.whenGET(${url}),  method=${method},   data=`, data, '  headers=', headers);

    // return error401_tokenExpired;

    let dataObject = angular.fromJson(data);

    if ( dataObject.hasOwnProperty('token') && dataObject.hasOwnProperty('password') ) {
      return [ 200, authenticate[4], {} ];
    }

    // If token or user_id is not provided, simulate that the server will returns an error
    return [ 400, { error: 'token_not_provided' }, {} ];
  });


  $httpBackend.whenGET(new RegExp(`${Data.buildApiUrl('participants')}(.*)`)).respond( (method, url, data, headers) => {
    $log.log(`$httpBackend.whenGET(${url}),  method=${method},   data=`, data, '  headers=', headers);

    return error500;
    // return [ 200, participant[headers.user_id], {} ];
  });

  $httpBackend.whenPOST(Data.buildApiUrl('partial_save')).respond( (method, url) => {
    $log.log(`$httpBackend.whenPOST(${url}),  method=${method}`);

    return [ 200, {}, {} ];
  });

  // Uncomment the line bellow to interact with the server
  $httpBackend.whenPOST(/https:\/\/www\.viacharacter\.org\/survey\/api1\/(.*)/).passThrough();
  // $httpBackend.whenPOST(/https:\/\/www\.viacharacter\.org\/survey\/api1\/(.*)/).respond( (method, url, data, headers) => {
  //   $log.log(`$httpBackend.whenGET(${url}),  method=${method},   data=`, data, '  headers=', headers);
  //   let reply = '';
  //   if ( url.includes('RegisterUser') ) {
  //     $log.log('Register User, replying with an error');
  //     reply = require('./mockBackEndResponse/viaSurvey/RegisterUser.html');
  //     return [ 500, reply, {}, 'You have already registered a user with this email address' ];
  //   }
  //   else if ( url.includes('LoginUser') ) {
  //     reply = '"276d51d7-10bf-4ff6-b5fe-9d0cd3ac5b3a"';
  //     $log.log(`LoginUser, replying with login key: ${reply}`);
  //     return [ 200, reply, {} ];
  //   }
  //   else if ( url.includes('StartSurvey') ) {
  //     reply = '"872546c2-2a9b-4df2-8966-e2ba661163a2"';
  //     $log.log(`StartSurvey, replying with session key: ${reply}`);
  //     return [ 200, reply, {} ];
  //   }
  //   else if ( url.includes('GetQuestions') ) {
  //     $log.log('GetQuestions, replying with the list of questions');
  //     reply = require('./mockBackEndResponse/viaSurvey/GetQuestions.json');
  //     return [ 200, reply, {} ];
  //   }
  //   else if ( url.includes('SubmitAnswers') ) {
  //     let dataObject = angular.fromJson(data);
  //     if ( dataObject.answers.length === 120 ) {
  //       reply = '"true"';
  //     }
  //     else {
  //       reply = '"false"';
  //     }
  //     $log.log(`SubmitAnswers, replying with ${reply} `);
  //     return [ 200, reply, {} ];
  //   }
  //   else if ( url.includes('GetResults') ) {
  //     $log.log('GetResults, replying with the list of 24 strengths');
  //     reply = require('./mockBackEndResponse/viaSurvey/GetResults.json');
  //     return [ 200, reply, {} ];
  //   }
  //
  //   return error500;
  // });

});
