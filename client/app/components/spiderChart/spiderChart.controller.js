class SpiderChartController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'SpiderChartController' );

    $log.log('constructor - START');

    this.name = 'spiderChart';
  }
}

export default SpiderChartController;
