class MainController {
  constructor($log, ZendeskWidget, User) {
    'ngInject';

    $log.info('main controller');

    ZendeskWidget.identify({
      name: `${User.getFirstName()} ${User.getLastName()}`,
      email: User.getEmail()
    });

    ZendeskWidget.show();

  }
}

export default MainController;
