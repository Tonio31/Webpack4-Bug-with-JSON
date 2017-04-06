class SpiderChartController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'SpiderChartController' );

    $log.log('constructor - START');

    this.name = 'spiderChart';

    this.$onInit = () => {
      $log.info('this.block.data', this.block.data);
    };

  }
}

export default SpiderChartController;
