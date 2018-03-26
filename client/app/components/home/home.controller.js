
class HomeController {

  constructor( $log,
               $state,
               $filter,
               User,
               Menu,
               ZendeskWidget,
               STATES,
               $window) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'Home' );


    $log.log('constructor::Start');

    this.firstName = User.getFirstName();

    this.currentProgression = Menu.getCurrentProgression();
    this.resumeProgressButtonText = '';

    this.menu = Menu.getMenu();

    this.isProgramCompleted = false;


    this.getDonutTitle = (iCycle) => {

      let donutTitle = '';

      if ( iCycle.status === 'locked' ) {
        // I use a homefont (fontello) that will display a lock icon when we try to display
        // the character 'l' and the font is 'fontello'
        // I had to do this trick because it was impossible to insert an image for the donut title
        // As we could only put text, we created our own font that contains only one character
        // http://fontello.com/
        donutTitle = 'l';
      }
      else {
        donutTitle = `${iCycle.progress.percent}%`;
      }

      return donutTitle;
    };

    this.resumeProgress = () => {
      if ( this.isProgramCompleted ) {
        $log.log('resumeProgress() - Program is completed, open left hand menu');
      }
      else {
        let currentStepStateName = this.currentProgression.data.current_step.fullUrl;
        $log.log(`resumeProgress() - change state to current step: ${currentStepStateName}`);
        $state.go(currentStepStateName);
      }
    };

    this.$onInit = () => {
      $log.log('constructor()::$onInit - BEGIN');

      if ( !this.currentProgression.data.current_step ) {
        this.isProgramCompleted = true;
        this.resumeProgressButtonText = $filter('translate')('OPEN_MENU').toUpperCase();
      }
      else {
        let stepName = this.currentProgression.data.current_step.name;
        if ( stepName.length >= 25 ) {
          stepName = `${stepName.slice(0, 25)}...`;
        }

        this.resumeProgressButtonText = `${this.currentProgression.data.current_step.title} • ${stepName}`.toUpperCase();
      }

      $log.log('dynamicContent=', this.content);

      $log.log('constructor()::$onInit - END');
    };


    this.goToFAQs = () => {
      $log.log('goToFAQs()');
      $log.log('User.getFirstName()=', User.getFirstName());
      $window.open('https://support.potentialife.com', '_blank');
    };

    this.sendUsEmail = () => {
      $log.log('sendUsEmail');
      ZendeskWidget.activate();
    };

    // For small screens, we only want to display the current cycle
    // If the user completed the program, there is no current cycle, we then display the last one
    this.isCycleDisplayedForSmallScreen = (iCycle) => {

      let isCycleDisplayed = false;

      if ( this.isProgramCompleted ) {
        let lastCycleIndex = this.menu.data.children.length - 1;
        isCycleDisplayed = iCycle.id === this.menu.data.children[lastCycleIndex].id;
      }
      else {
        isCycleDisplayed = ( iCycle.status === 'current' );
      }

      return isCycleDisplayed;
    };
  }

}


export default HomeController;
