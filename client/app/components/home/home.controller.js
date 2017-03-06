
class HomeController {

  constructor($log, $state, UserInfo, Menu) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'Home' );


    $log.log('constructor::Start');

    this.firstName = UserInfo.getFirstName();
    this.currentProgression = Menu.getCurrentProgression();
    this.menu = Menu.getMenu();
    this.quote = this.content;

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

      this.quote = this.content.data.quote;

      $log.log('constructor()::$onInit - END');
    };


    this.goToFAQs = () => {
      $log.log('goToFAQs()');
    };


    this.sendUsEmail = () => {
      $log.log('sendUsEmail()');
    };

  }

}


export default HomeController;
