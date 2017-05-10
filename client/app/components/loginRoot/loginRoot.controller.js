class LoginRootController {
  constructor(SpinnerFactory, SPINNERS) {
    'ngInject';

    this.topLevelSpinner = SpinnerFactory.getSpinner(SPINNERS.TOP_LEVEL);
  }
}

export default LoginRootController;
