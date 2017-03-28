class ModuleOverviewController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ModuleOverviewController' );

    $log.log('ModuleOverviewController');

    $log.info('MODULE OVERVIEW CTRL: ', this);

  }
}

export default ModuleOverviewController;
