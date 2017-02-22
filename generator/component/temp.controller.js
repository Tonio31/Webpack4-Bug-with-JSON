class <%= upCaseName %>Controller {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( '<%= upCaseName %>Controller' );

    this.name = '<%= name %>';
  }
}

export default <%= upCaseName %>Controller;
