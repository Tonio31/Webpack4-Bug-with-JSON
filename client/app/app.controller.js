class AppController {
  constructor(SpinnerFactory, SPINNERS) {
    'ngInject';

    this.topLevelSpinner = SpinnerFactory.getSpinner(SPINNERS.TOP_LEVEL);
  }
}

export default AppController;
