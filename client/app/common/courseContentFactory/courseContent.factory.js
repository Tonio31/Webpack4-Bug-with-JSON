let CourseContentFactory = function($log) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance( 'CourseContentController' );

  let inputs = [];
  let additionalDataToSave = [];

  let updateInputFields = (iIdentifier, iNewValue) => {
    $log.log('updateInputFields() iIdentifier=', iIdentifier, '    iNewValue=', iNewValue);
    inputs[iIdentifier] = iNewValue;
  };

  let getInputFields = () => {
    $log.log('getInputFields()');
    return inputs;
  };

  let clearInputFields = () => {
    $log.log('clearInputFields()');
    inputs.length = 0;
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
    additionalDataToSave.length = 0;
  };


  return {
    updateInputFields,
    getInputFields,
    clearInputFields,
    saveDataToSendLater,
    getAdditionalData,
    clearAdditionalData
  };

};

export default CourseContentFactory;
