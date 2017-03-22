import BarChartModule from './barChart';
import BarChartController from './barChart.controller';
import BarChartComponent from './barChart.component';
import BarChartTemplate from './barChart.html';

describe('BarChart', () => {
  let $rootScope, $componentController, $compile;
  let COLUMN_ID;

  let dataBindings = {
    id: 58,
    type: 'static',
    element: 'bar_chart',
    data: {
      title: 'Your strengths breakdown',
      bars: [
        {
          title: 'Work',
          color: '#d3d3d3',
          value: 0
        },
        {
          title: 'Non-Work',
          color: 'green',
          value: 31
        },
        {
          title: 'Sleep',
          color: 'blue',
          value: 95
        },
        {
          title: 'Whatever',
          color: 'red',
          value: 100
        }
      ]
    }
  };

  beforeEach(window.module(BarChartModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    COLUMN_ID = $injector.get('COLUMN_ID');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;

    let bindings = {
      block: dataBindings
    };

    beforeEach(() => {
      controller = $componentController('barChart', {
        $scope: $rootScope.$new()
      }, bindings);
    });

    it('formatLabels return the value with a percentage for all columns expect remaining and spaceOnTop', () => {
      expect(controller.formatLabels(0, 'some-column-id')).to.eq('0%');
      expect(controller.formatLabels(100, 'some-column-id')).to.eq('100%');

      // For all null value (all columnId have null value for their data in other columns), return empty label
      expect(controller.formatLabels(null, 'some-column-id')).to.eq('');

      // formatLabels will be called for undefined columnId (could not figure out why). Whatever we return, the data won't be used
      // for undefined columnId but better to return empty label to be safe
      expect(controller.formatLabels(100, undefined)).to.eq('');

      // remaining is a special category used to display the remaining of the 100%, we should not display a label for it
      expect(controller.formatLabels(20, COLUMN_ID.remaining)).to.eq('');

      // spaceOnTop is a special category used to Hack the display in order to still have space on top to display the label if the bar is more than 90%
      expect(controller.formatLabels(20, COLUMN_ID.spaceOnTop)).to.eq('');
    });

    it('$onInit creates the data needed for displaying the bar chart', () => {
      controller.$onInit();
      expect(controller.chartColumns).to.deep.eq([
        {
          id: COLUMN_ID.xLabels
        },
        {
          id: 'Work',
          name: 'Work',
          color: '#d3d3d3',
          type: 'bar'
        },
        {
          id: 'Non-Work',
          name: 'Non-Work',
          color: 'green',
          type: 'bar'
        },
        {
          id: 'Sleep',
          name: 'Sleep',
          color: 'blue',
          type: 'bar'
        },
        {
          id: 'Whatever',
          name: 'Whatever',
          color: 'red',
          type: 'bar'
        },
        {
          id: COLUMN_ID.remaining,
          type: 'bar',
          name: COLUMN_ID.remaining,
          color: 'transparent'
        },
        {
          id: COLUMN_ID.spaceOnTop,
          type: 'bar',
          name: COLUMN_ID.spaceOnTop,
          color: 'transparent'
        }
      ]);

      expect(controller.chartData).to.deep.eq( [
        {
          'pl2-x-label': 'Work',
          'pl2-spaceOnTop': 20,
          'pl2-remaining': 100,
          'Work': 0
        },
        {
          'pl2-x-label': 'Non-Work',
          'pl2-spaceOnTop': 20,
          'pl2-remaining': 69,
          'Non-Work': 31
        },
        {
          'pl2-x-label': 'Sleep',
          'pl2-spaceOnTop': 20,
          'pl2-remaining': 5,
          'Sleep': 95
        },
        {
          'pl2-x-label': 'Whatever',
          'pl2-spaceOnTop': 20,
          'pl2-remaining': 0,
          'Whatever': 100
        }
      ] );

      expect(controller.chartGroup).to.eq(`Work,Non-Work,Sleep,Whatever,${COLUMN_ID.remaining},${COLUMN_ID.spaceOnTop},`);
    });

  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = dataBindings;
      template = $compile('<div><bar-chart block="block"></bar-chart></div>')(scope);
      scope.$apply();
    });

    it('The chart has a title', () => {
      expect(template.find('p').html()).to.eq(dataBindings.data.title);
    });


    it('There is a chart on the page', () => {
      let chart = angular.element(template[0].querySelector(`#barChart-${dataBindings.id}`));
      expect(chart.length).to.eq(1); // Element exist on DOM

      let chartAxes = template.find('chart-axes');
      expect(chartAxes.length).to.eq(1); // Element exist on DOM
    });

  });

  describe('Component', () => {
    // component/directive specs
    let component = BarChartComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(BarChartTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(BarChartController);
    });
  });
});
