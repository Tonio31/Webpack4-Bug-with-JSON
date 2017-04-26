class FriendsSurveyController {
  constructor($log, $localStorage, $state, $stateParams, $location, STATES, TOKEN_SURVEY, ContentFactory) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'FriendsSurveyController' );

    $log.log('constructor - START');

    this.$onInit = () => {
      $log.log('$state=', $state);

        // User should not be able to access this page if they don't have a TOKEN_SURVEY, on 360_Survey/1,
        // we will store locally the TOKEN_SURVEY and use this to know if the user can have access

      if ( $state.current.name === `${STATES.SURVEY}/1` &&
           $stateParams.hasOwnProperty(TOKEN_SURVEY) &&
           angular.isDefined($stateParams[TOKEN_SURVEY]) ) {
        $localStorage[TOKEN_SURVEY] = $stateParams[TOKEN_SURVEY];
        $location.search(TOKEN_SURVEY, null);
      }
      else if ( angular.isUndefined($localStorage[TOKEN_SURVEY]) ) {
        $log.log(`Tried to access ${$state.current.name} no ${TOKEN_SURVEY} provided or stored locally, redirect to 404 page`);
        $state.go(STATES.PAGE_NOT_FOUND_NO_MENU, { intendedUrl: $location.url() });
      }

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
