class ModuleOverviewController {
  constructor($log, ICON_FONTELLO) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'ModuleOverviewController' );

    this.name = 'Module 1 - Overview';
  }
}

export default ModuleOverviewController;
