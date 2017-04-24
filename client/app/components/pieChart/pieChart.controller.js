class PieChartController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'PieChartController' );

    $log.log('PieChartController');

    this.chartColumns = [];
    this.chartData = [];
    this.chartGroup = '';

    this.$onInit = () => {

      for ( let segment of this.block.data.segments ) {

        let column = {
          id: segment.title,
          name: segment.title,
          color: segment.color,
          type: 'pie'
        };

        let data = {
          [segment.title]: segment.value
        };

        this.chartColumns.push(column);
        this.chartData.push(data);
        this.chartGroup += `${segment.title},`;
      }

    };

  }
}

export default PieChartController;
