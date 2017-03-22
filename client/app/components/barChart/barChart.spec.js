import BarChartModule from './barChart';
import BarChartController from './barChart.controller';
import BarChartComponent from './barChart.component';
import BarChartTemplate from './barChart.html';

describe('BarChart', () => {
  let $rootScope, $componentController, $compile;

  beforeEach(window.module(BarChartModule));

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
    beforeEach(() => {
      controller = $componentController('barChart', {
        $scope: $rootScope.$new()
      });
    });


    it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
      expect(controller).to.have.property('name');
    });
  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<bar-chart></bar-chart>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('barChart');
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
