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

  // **************************************************************************************
  //       Hooks to insert specific actions when clicking on Next/Previous button

  // This hook is after the field validation but before submitting a step, if it is defined
  // it will be executed instead of the default action to submit step, it can be used to have multipage
  // on a single step (like viaSurvey)
  let nextButtonPreActionFn = undefined;
  let nextButtonPreActionArguments = undefined;
  let setNextStepButtonPreSaveAction = (iFuncToExecute, ...iArgs) => {
    nextButtonPreActionFn = iFuncToExecute;
    nextButtonPreActionArguments = iArgs;
  };

  let isNextButtonPreSaveAction = () => {
    return angular.isDefined(nextButtonPreActionFn);
  };

  let nextStepButtonPreSaveAction = () => {
    nextButtonPreActionFn(nextButtonPreActionArguments);
  };

  // This hook is before the validation of the fields, it will be executed and the normal code of
  // nextStep() will be executed after
  let beforeNextStepValidationFn = undefined;
  let beforeNextStepValidationArguments = undefined;
  let setBeforeNextStepValidation = (iFuncToExecute, ...iArgs) => {
    beforeNextStepValidationFn = iFuncToExecute;
    beforeNextStepValidationArguments = iArgs;
  };

  let beforeNextStepValidation = () => {
    if ( angular.isDefined(beforeNextStepValidationFn) ) {
      beforeNextStepValidationFn(beforeNextStepValidationArguments);
    }
  };

  // This hook is after the field validation but before submitting a step, if it is defined
  // it will be executed instead of the default action to submit step, it can be used to have multipage
  // on a single step (like viaSurvey)
  let previousButtonPreActionFn = undefined;
  let previousButtonPreActionArguments = undefined;
  let setPreviousStepButtonPreAction = (iFuncToExecute, ...iArgs) => {
    previousButtonPreActionFn = iFuncToExecute;
    previousButtonPreActionArguments = iArgs;
  };

  let isPreviousButtonPreAction = () => {
    return angular.isDefined(previousButtonPreActionFn);
  };

  let previousStepButtonPreSaveAction = () => {
    previousButtonPreActionFn(previousButtonPreActionArguments);
  };


  return {
    updateInputFields,
    getInputFields,
    clearInputFields,
    saveDataToSendLater,
    getAdditionalData,
    clearAdditionalData,
    setNextStepButtonPreSaveAction,
    isNextButtonPreSaveAction,
    nextStepButtonPreSaveAction,
    beforeNextStepValidation,
    setBeforeNextStepValidation,
    setPreviousStepButtonPreAction,
    isPreviousButtonPreAction,
    previousStepButtonPreSaveAction
  };

};

export default CourseContentFactory;
