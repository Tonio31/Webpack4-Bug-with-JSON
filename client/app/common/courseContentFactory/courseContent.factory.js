let CourseContentFactory = function($log) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance( 'CourseContentFactory' );

  let inputs = {};
  let additionalDataToSave = {};

  let updateInputFields = (iIdentifier, iNewValue) => {
    $log.log('updateInputFields() iIdentifier=', iIdentifier, '    iNewValue=', iNewValue);
    inputs[iIdentifier] = iNewValue;
  };

  let getInputFields = () => {
    $log.log('getInputFields()');
    return inputs;
  };

  let clearInputFields = () => {
    $log.log('clearInputFields() BEFORE inputs =', inputs);
    for ( let key of Object.keys(inputs) ) {
      delete inputs[key];
    }
    $log.log('clearInputFields() AFTER inputs =', inputs);
  };

  let saveDataToSendLater = (iIdentifier, iNewValue) => {
    $log.log('saveDataToSendLater() iIdentifier=', iIdentifier, '    iNewValue=', iNewValue);
    additionalDataToSave[iIdentifier] = iNewValue;
  };

  let getAdditionalData = () => {
    $log.log('getAdditionalData()');
    return additionalDataToSave;
  };

  let clearAdditionalData = () => {
    $log.log('clearAdditionalData()');
    for ( let key of Object.keys(additionalDataToSave) ) {
      delete additionalDataToSave[key];
    }
  };


  let nextButtonPreActionFn = undefined;
  let nextButtonPreActionArguments = undefined;

  let setNextStepButtonPreAction = (iFuncToExecute, ...iArgs) => {
    nextButtonPreActionFn = iFuncToExecute;
    nextButtonPreActionArguments = iArgs;
  };

  let isNextButtonPreAction = () => {
    return angular.isDefined(nextButtonPreActionFn);
  };

  let nextStepButtonPreAction = () => {
    nextButtonPreActionFn(nextButtonPreActionArguments);
  };

  return {
    updateInputFields,
    getInputFields,
    clearInputFields,
    saveDataToSendLater,
    getAdditionalData,
    clearAdditionalData,
    setNextStepButtonPreAction,
    isNextButtonPreAction,
    nextStepButtonPreAction
  };

};

export default CourseContentFactory;
