class BarChartController {
  constructor($log, COLUMN_ID) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'BarChartController' );

    // Used to pass COLUMN_ID.xLabels to <chart-axes> directive
    this.COLUMN_ID = COLUMN_ID;

    this.formatLabels = (iValue, iColumnId) => {
      if ( iColumnId && iColumnId !== COLUMN_ID.remaining && iColumnId !== COLUMN_ID.spaceOnTop && iValue !== null ) {
        $log.log('formatLabels   iValue=', iValue, '   iColumnId=', iColumnId);
        return `${iValue}%`;
      }

      return '';
    };


    this.chartColumns = [
      {
        id: COLUMN_ID.xLabels
      }

    ];
    this.chartData = [];
    this.chartGroup = '';



    this.$onInit = () => {

      for ( let bar of this.block.data.bars ) {

        let column = {
          id: bar.title,
          name: bar.title,
          color: bar.color,
          type: 'bar'
        };

        let data = {
          [COLUMN_ID.xLabels]: bar.title,
          [COLUMN_ID.spaceOnTop]: 20, // The bigger the number, the bigger the space on top of the chart
          [COLUMN_ID.remaining]: 100 - bar.value,
          [bar.title]: bar.value
        };


        this.chartColumns.push(column);
        this.chartData.push(data);
        this.chartGroup += `${bar.title},`;
      }

      // This category is used to draw the dotted shape on top of the main category
      // The value on each column will be ( 100 - value of this column)
      this.chartColumns.push({
        id: COLUMN_ID.remaining,
        type: 'bar',
        name: COLUMN_ID.remaining,
        color: 'transparent'
      });
      this.chartGroup += `${COLUMN_ID.remaining},`;

      // This category is a small hack, it is used to create an extra space on top of the chart bar
      // so when the column is 100%, the label is still shown on top (without it, the label will not
      // be displayed as the height of the chart is fixed by the size of the bars, so the label will be
      // out of the chart
      this.chartColumns.push({
        id: COLUMN_ID.spaceOnTop,
        type: 'bar',
        name: COLUMN_ID.spaceOnTop,
        color: 'transparent'
      });
      this.chartGroup += `${COLUMN_ID.spaceOnTop},`;


      $log.log('onInit - this.chartColumns=', this.chartColumns);
      $log.log('onInit - this.chartData=', this.chartData);
      $log.log('onInit - this.chartGroup=', this.chartGroup);

    };
  }
}

export default BarChartController;
