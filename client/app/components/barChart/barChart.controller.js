class BarChartController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'BarChartController' );

    this.name = 'barChart';

    this.formatLabels = (iValue, iColumnId, iIndexColumn, iSubIndexColumn) => {
      $log.log('formatLabels   iValue=', iValue, '   iColumnId=', iColumnId, '   iIndexColumn=', iIndexColumn, '   iSubIndexColumn=', iSubIndexColumn);
      if ( iColumnId && iColumnId !== 'remaining' && iValue !== 0 ) {
        return `${iValue}%`;
      }

      return '';
    };

    this.chart = undefined;
    this.handleCallback = (chartObj) => {
      $log.log('chartObj=', chartObj);
      this.chart = chartObj;
    };

    this.chartColumns = [
      {
        id: 'x-label'
      },
      {
        id: 'remaining',
        type: 'bar',
        name: 'remaining',
        color: 'transparent'
      }
    ];
    this.chartData = [];
    this.chartGroup = '';

    this.$onInit = () => {
      $log.log('onInit - this.data=', this.data);

      for ( let bar of this.data.bars ) {
        $log.log('1  bar=', bar);

        let column = {
          id: bar.title,
          name: bar.title,
          color: bar.color,
          type: 'bar'
        };

        let data = {
          'x-label': bar.title,
          [bar.title]: bar.value,
          'remaining': 100 - bar.value,
          'test': 28
        };


        this.chartColumns.push(column);
        this.chartData.push(data);
        this.chartGroup += `,${bar.title}`;
      }

      this.chartGroup += ',remaining';

      for ( let bar of this.data.bars ) {
        $log.log('2  bar=', bar);

        for ( let data of this.chartData ) {
          if ( !data.hasOwnProperty(bar.title) ) {
            data[bar.title] = 0;
          }
        }
      }

      $log.log('onInit - this.chartColumns=', this.chartColumns);
      $log.log('onInit - this.chartData=', this.chartData);
      $log.log('onInit - this.chartGroup=', this.chartGroup);
    };
  }
}

export default BarChartController;
