class FriendsSurveyController {
  constructor($log, $localStorage, $state, $location, STATES, SURVEY_360, ContentFactory) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'FriendsSurveyController' );

    $log.log('constructor - START');

    this.$onInit = () => {
      $log.warn('$onInit()');

      // Delete the token_survey if it's the last page (3), otherwise store the token_survey to be sent when saving user data
      if ( $state.current.name === `${STATES.SURVEY}/3` ) {
        // Last step of the survey, it is done we can delete the token in local storage
        delete $localStorage[SURVEY_360.TOKEN];
        ContentFactory.clearAdditionalData();
      }
      else {
        // All other steps need to send the token to the back end
        ContentFactory.saveDataToSendLater(SURVEY_360.TOKEN, $localStorage[SURVEY_360.TOKEN]);
      }
    };
  }
}

export default FriendsSurveyController;
