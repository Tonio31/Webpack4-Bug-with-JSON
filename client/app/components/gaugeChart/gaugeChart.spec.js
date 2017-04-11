import GaugeChartModule from './gaugeChart';
import GaugeChartController from './gaugeChart.controller';
import GaugeChartComponent from './gaugeChart.component';
import GaugeChartTemplate from './gaugeChart.html';

describe('GaugeChart', () => {
  let $rootScope;
  // let $componentController;
  let $compile;

  beforeEach(window.module(GaugeChartModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    // $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  // describe('Controller', () => {
  //   // controller specs
  //   let controller;
  //   beforeEach(() => {
  //     controller = $componentController('gaugeChart', {
  //       $scope: $rootScope.$new()
  //     });
  //   });
  //
  //
  // });

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
