import SpiderChartModule from './spiderChart';
import SpiderChartController from './spiderChart.controller';
import SpiderChartComponent from './spiderChart.component';
import SpiderChartTemplate from './spiderChart.html';

describe('SpiderChart', () => {
  let $rootScope, $componentController, $compile;

  let dataBindings = {
    id: 63,
    type: 'static',
    element: 'spider_chart',
    data: {
      title: 'spider chart',
      set: [
        {
          className: 'user',
          axes: [
            {
              axis: 'Acceleration',
              value: 80
            },
            {
              axis: 'Breaking',
              value: 40
            },
            {
              axis: 'Handling',
              value: 40
            },
            {
              axis: 'Fuel',
              value: 90
            },
            {
              axis: 'Top speed',
              value: 60
            }
          ]
        }
      ]
    }
  };

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

    let bindings = {
      block: dataBindings
    };

    beforeEach(() => {
      controller = $componentController('spiderChart', {
        $scope: $rootScope.$new()
      }, bindings);
    });


    it('$onInit creates the data needed for displaying the bar chart', () => {
      controller.$onInit();
      expect(controller.userSpiderData).to.deep.eq([
        {
          id: 63,
          type: 'static',
          element: 'spider_chart',
          data: {
            title: 'spider chart',
            set: [
              {
                className: 'user',
                axes: [
                  {
                    axis: 'Acceleration',
                    value: 80
                  },
                  {
                    axis: 'Breaking',
                    value: 40
                  },
                  {
                    axis: 'Handling',
                    value: 40
                  },
                  {
                    axis: 'Fuel',
                    value: 90
                  },
                  {
                    axis: 'Top speed',
                    value: 60
                  }
                ]
              }
            ]
          }
        }
      ]);
    });
  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = dataBindings;
      template = $compile('<spider-chart block="block"></spider-chart>')(scope);
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
