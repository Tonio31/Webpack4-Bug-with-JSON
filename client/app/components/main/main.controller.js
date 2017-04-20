class MainController {
  constructor(ZendeskWidget, User) {
    'ngInject';

    ZendeskWidget.identify({
      name: `${User.getFirstName()} ${User.getLastName()}`,
      email: User.getEmail()
    });

    ZendeskWidget.show();
  }
}

export default MainController;
