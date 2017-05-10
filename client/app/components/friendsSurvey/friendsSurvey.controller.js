class FriendsSurveyController {
  constructor($log, $localStorage, $state, $location, STATES, TOKEN_SURVEY, ContentFactory) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'FriendsSurveyController' );

    $log.log('constructor - START');

    this.$onInit = () => {
      $log.warn('$onInit()');

      // Delete token_survey form the URL as it is already stored in local storage
      $location.search({});

      // Delete the token_survey if it's the last page (3), otherwise store the token_survey to be sent when saving user data
      if ( $state.current.name === `${STATES.SURVEY}/3` ) {
        // Last step of the survey, it is done we can delete the token in local storage
        delete $localStorage[TOKEN_SURVEY];
        ContentFactory.clearAdditionalData();
      }
      else {
        // All other steps need to send the token to the back end
        ContentFactory.saveDataToSendLater(TOKEN_SURVEY, $localStorage[TOKEN_SURVEY]);
      }
    };
  }
}

export default FriendsSurveyController;
