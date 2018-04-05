class NavbarMenuButtonController {
  constructor( $log,
               $filter,
               $state,
               Data,
               JwtFactory,
               ZendeskWidget,
               STATES,
               ICON_FONTELLO ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance('NavbarMenuButtonController');

    this.topTitle = '';
    this.bottomTitle = '';
    this.status = '';

    this.$onInit = () => {

      if ( this.data ) {

        this.type = this.data.type;
        this.status = this.data.status;

        this.topTitle = this.data.title;

        // For steps, we want to add the step number in front
        if ( this.type === 'STEP' && this.data.stepNumber ) {
          this.bottomTitle = `${this.data.stepNumber}. `;
        }
        this.bottomTitle += this.data.name;

        if ( this.category === 'back-button') {
          this.status = 'back';

          if ( this.type === 'MODULE' ) {
            this.topTitle = this.data.levelTitle;
            this.bottomTitle = this.data.title;
          }
        }

      }
      else {
        $log.error('Input data is undefined, this should never happens');
      }

    };


    this.$onChanges = () => {

      if ( this.category !== 'back-button' && this.status !== this.data.status ) {
        $log.log('$onChanges updating oldStatus=', this.status, '   newStatus=', this.data.status);
        this.status = this.data.status;
      }
    };

    // Used to know if the current state is the one pointed by this button link
    // For hidden steps, we need to highlight the button even if the full url don't match
    this.isStepActive = () => {

      if ( this.category !== 'back-button' && $state.current.name.includes(this.data.fullUrl) ) {
        return true;
      }

      return false;
    };

    this.isVideoStep = () => {
      return this.data.category && this.data.category.toLowerCase() === 'video';
    };

    this.getIconValue = () => {

      if ( this.isStepActive() ) {
        return ICON_FONTELLO.ARROW_RIGHT;
      }
      else if ( this.isVideoStep() ) {
        return ICON_FONTELLO.VIDEO;
      }

      return '';
    };

    this.menuButtonClick = () => {
      if ( this.status === 'logout' ) {
        $log.log('LOGOUT Clicked!!');
        this.logout();
      }
    };

    this.logout = () => {
      // Unvalidate Token on server side
      Data.logout().$save();

      // Remove Token from local Storage
      JwtFactory.logout();

      // Hide Zendesk Widget
      ZendeskWidget.hide();

      // Go to login state
      $state.go(STATES.LOGIN);
    };

  }
}

export default NavbarMenuButtonController;
