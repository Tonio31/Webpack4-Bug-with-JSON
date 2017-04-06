import SpiderChartModule from './spiderChart';
import SpiderChartController from './spiderChart.controller';
import SpiderChartComponent from './spiderChart.component';
import SpiderChartTemplate from './spiderChart.html';

describe('SpiderChart', () => {
  let $rootScope, $componentController, $compile;

  beforeEach(window.module(SpiderChartModule));

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
      controller = $componentController('spiderChart', {
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
      template = $compile('<spider-chart></spider-chart>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('spiderChart');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = SpiderChartComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(SpiderChartTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(SpiderChartController);
    });
  });
});
