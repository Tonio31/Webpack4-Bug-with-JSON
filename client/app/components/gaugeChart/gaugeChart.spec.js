import GaugeChartModule from './gaugeChart';
import GaugeChartController from './gaugeChart.controller';
import GaugeChartComponent from './gaugeChart.component';
import GaugeChartTemplate from './gaugeChart.html';

describe('GaugeChart', () => {
  let $rootScope, $componentController, $compile;

  beforeEach(window.module(GaugeChartModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;

    let bindings = {
      block: {
        id: 62,
        type: 'static',
        element: 'gauge_chart',
        data: {
          title: 'gauge chart',
          gauge: {
            unit: '',
            colour: '#6638F0',
            value: 8,
            min: 0,
            max: 12,
            suffix_label: ' hours'
          }
        }
      }
    };

    beforeEach(() => {
      controller = $componentController('gaugeChart', {
        $scope: $rootScope.$new()
      }, bindings);
    });

    it('formatLabel() - builds the good label', () => {
      expect(controller.formatLabel()).to.eq('8 hours');
    });

  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<gauge-chart></gauge-chart>')(scope);
      scope.$apply();
    });


    it('There is a chart on the page', () => {
      let chart = angular.element(template[0].querySelector('.gauge-chart'));
      expect(chart.length).to.eq(1); // Element exist on DOM
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = GaugeChartComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(GaugeChartTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(GaugeChartController);
    });
  });
});
