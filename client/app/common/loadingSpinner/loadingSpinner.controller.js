class LoadingSpinnerController {
  constructor($log, SpinnerFactory) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'LoadingSpinnerController' );


    this.$onInit = () => {

      $log.log('$onInit() - this.name=', this.name, 'this.show=', this.show, '   this.displayLogo=', this.displayLogo);

      // By default, show the logo
      if ( angular.isUndefined(this.displayLogo) ) {
        this.displayLogo = true;
      }

      // By default, hide the message
      if ( angular.isUndefined(this.displayMessage) ) {
        this.displayMessage = false;
      }

      this.spinner = SpinnerFactory.getSpinner(this.name);

      if ( this.show ) {
        SpinnerFactory.show(this.name);
      }
      else {
        SpinnerFactory.hide(this.name);
      }

    };

  }
}

export default LoadingSpinnerController;
