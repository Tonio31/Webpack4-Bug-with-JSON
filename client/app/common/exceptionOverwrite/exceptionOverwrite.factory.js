let ExceptionOverwriteFactory = function( $log, $state, STATES ) {
  'ngInject';

  // eslint-disable-next-line no-param-reassign
  $log = $log.getInstance( 'ExceptionOverwriteFactory' );

  let myExceptionHandler = (exception, cause) => {
    $log.error(exception, cause);

    $state.go(STATES.ERROR_PAGE,
      {
        errorMsg: 'ERROR_UNEXPECTED',
        bugsnagMetaData : {
          Error: exception ? exception.message : 'Unknown Error'
        }
      }, { reload: true });
  };


  return myExceptionHandler;
};

export default ExceptionOverwriteFactory;
