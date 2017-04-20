class LoadingSpinnerController {
  constructor($log, SpinnerFactory) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'LoadingSpinnerController' );


    this.$onInit = () => {

      $log.debug('$onInit() - this.name=', this.name, 'this.show=', this.show);

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
