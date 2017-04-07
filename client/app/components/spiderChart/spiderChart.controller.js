import d3 from 'd3';
import * as RadarChart from 'radar-chart-d3';

class SpiderChartController {
  constructor($log) {
    'ngInject';

    // eslint-disable-next-line no-param-reassign
    $log = $log.getInstance( 'SpiderChartController' );

    $log.log('constructor - START');

    this.name = 'spiderChart';

    this.spiderData = [
    {
      className: 'germany',
      axes: [
        {
          axis: 'strength',
          value: 13,
          yOffset: 10
        },
        {
          axis: 'intelligence',
          value: 6
        },
        {
          axis: 'charisma',
          value: 5
        },
        {
          axis: 'dexterity',
          value: 9
        },
        {
          axis: 'luck',
          value: 2,
          xOffset: -20
        }
      ]
    },
    {
      className: 'argentina',
      axes: [
        {
          axis: 'strength',
          value: 6
        },
        {
          axis: 'intelligence',
          value: 7
        },
        {
          axis: 'charisma',
          value: 10
        },
        {
          axis: 'dexterity',
          value: 13
        },
        {
          axis: 'luck',
          value: 9
        }
      ]
    }
  ];

    this.$onInit = () => {
      $log.info('this.block.data', this.block.data);

      // RadarChart.draw('.chart-container', this.spiderData);

      $log.info('RadarChart', RadarChart);


    };

  }
}

export default SpiderChartController;
