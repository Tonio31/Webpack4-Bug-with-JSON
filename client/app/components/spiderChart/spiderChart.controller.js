class SpiderChartController {
  constructor($log, somethingChart) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'SpiderChartController' );

    $log.log('constructor - START');

    this.name = 'spiderChart';

    $log.info('somethingChart', somethingChart);


    // RadarChart.draw("#chart", data, config);

  }
}

export default SpiderChartController;
