class GaugeChartController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'GaugeChartController' );

    $log.log('constructor - START');
    this.formatLabel = () => {
      return `${this.block.data.gauge.value}${this.block.data.gauge.suffix_label}`;
    };

  }
}

export default GaugeChartController;
