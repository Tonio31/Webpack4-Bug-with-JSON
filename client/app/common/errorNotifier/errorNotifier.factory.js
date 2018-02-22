let ErrorNotifierFactory = function() {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  // $log = $log.getInstance( 'ErrorNotifierFactory' );

  // This will be the container for the error object, a ref to this object is used in other modules,
  // so it's important to never re-assign the top level object (to don't loose the reference to it)
  let data = {
    displayErrorPage: false,
    errorMsg: '',
    displayContactUsForm: false,
    bugsnagErrorName: '',
    bugsnagMetaData: {}
  };

  let displayErrorPage = (iData) => {
    data.displayErrorPage = true;
    if ( iData ) {
      data.errorMsg = iData.errorMsg;
      data.displayContactUsForm = iData.displayContactUsForm;
      data.bugsnagErrorName = iData.bugsnagErrorName;
      data.bugsnagMetaData = iData.bugsnagMetaData;
    }
  };

  let hideErrorPage = () => {
    data.displayErrorPage = false;
    data.errorMsg = '';
    data.displayContactUsForm = false;
    data.bugsnagErrorName = '';
    data.bugsnagMetaData = {};
  };

  let isErrorPageDisplayed = () => {
    return data;
  };

  return {
    displayErrorPage,
    hideErrorPage,
    isErrorPageDisplayed
  };
};

export default ErrorNotifierFactory;
