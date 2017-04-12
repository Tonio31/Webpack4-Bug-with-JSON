
class HomeController {

  constructor($log, $state, User, Menu, ZendeskWidget, $window) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'Home' );


    $log.log('constructor::Start');

    this.firstName = User.getFirstName();


    this.currentProgression = Menu.getCurrentProgression();
    this.menu = Menu.getMenu();

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
      let currentStepStateName = Menu.getCurrentProgression().data.current_step.fullUrl;
      $log.log(`Resume Progress, change state to current step: ${currentStepStateName}`);
      $state.go(currentStepStateName);
    };

    this.$onInit = () => {
      $log.log('constructor()::$onInit - BEGIN');

      $log.log('dynamicContent=', this.content);

      $log.log('constructor()::$onInit - END');
    };


    this.goToFAQs = () => {
      $log.log('goToFAQs()');
      $log.log('User.getFirstName()=', User.getFirstName());
      $window.open('https://support.potentialife.com', '_blank');
    };

    this.sendUsEmail = () => {
      $log.info('sendUsEmail');
      ZendeskWidget.identify({
        name: `${User.getFirstName()} ${User.getLastName()}`,
        email: User.getEmail()
      });
      ZendeskWidget.activate();
    };

  }

}


export default HomeController;
