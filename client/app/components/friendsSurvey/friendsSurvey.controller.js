class FriendsSurveyController {
  constructor($log, $stateParams, ContentFactory) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'FriendsSurveyController' );

    $log.log('constructor - START');

    this.name = 'friendsSurvey';

    this.$onInit = () => {
      $log.debug('content=', this.content);
      $log.debug('$stateParams=', $stateParams);
      if ( $stateParams.hasOwnProperty('token') ) {
        ContentFactory.saveDataToSendLater('token', $stateParams.token);
      }
    };
  }
}

export default FriendsSurveyController;
