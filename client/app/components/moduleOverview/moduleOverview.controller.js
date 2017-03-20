class ModuleOverviewController {
  constructor($log, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ModuleOverviewController' );

    $log.info('moduleOverview this:', this);
    

    this.name = 'Module 1 - Overview';
  }
}

export default ModuleOverviewController;
