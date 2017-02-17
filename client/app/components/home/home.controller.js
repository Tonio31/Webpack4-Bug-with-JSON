
class HomeController {

  constructor($log, $translate, $state, $sce, Data, UserInfo, Menu) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'Home' );


    $log.log('constructor::Start');

    this.firstName = UserInfo.getFirstName();
    this.currentProgression = Menu.getCurrentProgression();
    this.menu = Menu.getMenu();
    this.quote = this.content;


    this.resumeProgress = () => {
      let currentStepUrl = Menu.getCurrentProgression().data.current_step.fullUrl;
      $log.log(`Resume Progress, change state to current step: ${currentStepUrl}`);
      $state.go(currentStepUrl);
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
