let UtilityFactory = function( $log, $q, $state, $window, $localStorage, User, Data ) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance('UtilityFactory');

  let goToLink = (iUrl) => {
    let reExternalUrl = /^https?:\/\/.*$/;
    if ( iUrl.match(reExternalUrl) ) {
      $log.log('About to redirect to different URL: ', iUrl);
      $window.location.href = iUrl;
    }
    else {
      $log.log('About to change state to go to: ', iUrl);
      $state.go(iUrl);
    }
  };

  let buildLocalStorageKey = (iKey) => {
    return `${User.getUserId()}-${iKey}`;
  };


  // This function is used when the server returns an error when saving the data from a courseContent
  // We save the user input to local storage so we can restore it when they refresh the page
  let saveUserInputToLocalStorage = (iInputFields) => {
    Object.entries(iInputFields).forEach( ([ key, value ]) => {
      $log.log(`storing ${buildLocalStorageKey(key)}:${value} to local storage`);
      $localStorage[buildLocalStorageKey(key)] = angular.toJson(value, false);
    });
  };

  let getUserInputFromLocalStorage = (iKey) => {
    return angular.fromJson($localStorage[buildLocalStorageKey(iKey)]);
  };

  // If there was an error before, user inputs will have been saved to local storage, if user refresh and retry
  // the data is safely saved on server side, we can remove the data form local storage
  let removeUserInputFromLocalStorage = (iInputFields) => {

    // eslint-disable-next-line no-unused-vars
    for ( let [ key, value ] of Object.entries(iInputFields)) {
      $log.log(`deleting ${buildLocalStorageKey(key)} from local storage`);
      delete $localStorage[buildLocalStorageKey(key)];
    }
  };


  // Communication between CourseContent and Block controllers, this is used to trigger some actions when the user clicks
  // on next button, for some cases we might want to do something different actions than submit the results to Back End
  let actionBeforeSavingStep = {};

  let setSubmitSurvey = (iAppKey, iLoginKey, iSessionKey, iAnswers) => {
    actionBeforeSavingStep.submitViaSurvey = {
      appKey: iAppKey,
      loginKey: iLoginKey,
      sessionkey: iSessionKey,
      answers: iAnswers
    };
  };

  let doThingsBeforeSubmitCurrentStep = () => {
    // let deferred = $q.defer();
    if ( actionBeforeSavingStep.hasOwnProperty('submitViaSurvey') ) {

      let submitAnswerParams = {
        appKey: actionBeforeSavingStep.submitViaSurvey.appKey,
        loginKey: actionBeforeSavingStep.submitViaSurvey.loginKey,
        sessionkey: actionBeforeSavingStep.submitViaSurvey.sessionKey,
        answers: actionBeforeSavingStep.submitViaSurvey.answers
      };

      let submitAnswersPost = Data.viaSurvey();
      Object.assign(submitAnswersPost, submitAnswerParams);
      submitAnswersPost.$submitAnswers( (dataBackFromSubmitAnswers) => {
        // If the SubmitAnswers service returns true, all answers have been submitted. If it returns false, more questions remain to
        // be answered and can be retrieved by a subsequent call to GetQuestions.
        $log.log('Success login dataBackFromSubmitAnswers=', dataBackFromSubmitAnswers);
        if ( dataBackFromSubmitAnswers.response ) {

          // TO DO Get the results
          $log.log('All answers have been submitted, ready to get the results');
        }
        else {
          $log.log('Not all the questions were submitted to ViaSurvey. SubmitAnswers API returned false');
        }
      });
    }
  };


  return {
    saveUserInputToLocalStorage,
    getUserInputFromLocalStorage,
    removeUserInputFromLocalStorage,
    buildLocalStorageKey,
    doThingsBeforeSubmitCurrentStep,
    setSubmitSurvey,
    goToLink
  };
};

export default UtilityFactory;
