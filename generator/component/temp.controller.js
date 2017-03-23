class <%= upCaseName %>Controller {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( '<%= upCaseName %>Controller' );

    $log.log('constructor - START');

    this.name = '<%= name %>';
  }
}

export default <%= upCaseName %>Controller;
