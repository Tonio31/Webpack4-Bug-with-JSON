class LineChartController {
  constructor( $log ) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'LineChartController' );

    $log.log( 'constructor - START' );

    this.xLabels = 'pl2-x-label';

    this.chartData = [];
    this.chartColumns = [
      {
        id: this.xLabels
      },
    ];

    this.$onInit = () => {
      $log.log( '$onInit - BEGIN this.data' );

      if ( this.block.data.y_label_suffix === null ) {
        this.block.data.y_label_suffix = '';
      }

      this.block.data.x_column_names.forEach( ( xColumnName, index ) => {
        this.chartData[index] = {
          [this.xLabels]: xColumnName
        };
      } );

      for ( let line of this.block.data.lines ) {
        let column = {
          id: line.title,
          name: line.title,
          color: line.color,
          type: 'line'
        };
        this.chartColumns.push(column);

        line.values.forEach( ( xColumnValue, index ) => {
          this.chartData[index][line.title] = xColumnValue;
        } );

      }
    };

    this.formatYLabel = ( iLabel ) => {
      return `${iLabel}${this.block.data.y_label_suffix}`;
    };
  }
}

export default LineChartController;
