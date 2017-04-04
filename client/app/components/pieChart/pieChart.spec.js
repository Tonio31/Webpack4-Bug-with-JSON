import PieChartModule from './pieChart';
import PieChartController from './pieChart.controller';
import PieChartComponent from './pieChart.component';
import PieChartTemplate from './pieChart.html';

describe('PieChart', () => {
  let $rootScope;
  // let $componentController;
  let $compile;

  let dataBindings = {
    id: 60,
    type:'static',
    element:'pie_chart',
    data: {
      title:'why people should use pie charts',
      segments:[
        {
          title: 'looks delicious',
          color: '#B0F566',
          value: 124
        },
        {
          title: 'Easy to Eat',
          color: '#4AF2A1',
          value: 65
        },
        {
          title: 'Fruit/Savoury',
          color: '#5CC9F5',
          value: 35
        },
        {
          title: 'Fits in most pockets',
          color: '#6638F0',
          value: 18
        }
      ]
    }
  };

  beforeEach(window.module(PieChartModule));

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
  //
  //   let bindings = {
  //     block: dataBindings
  //   };
  //
  //   beforeEach(() => {
  //     controller = $componentController('pieChart', {
  //       $scope: $rootScope.$new()
  //     }, bindings);
  //   });
  //
  //
  // });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = dataBindings;
      template = $compile('<pie-chart block="block"></pie-chart>')(scope);
      scope.$apply();
    });


    it('There is a chart on the page', () => {
      let chart = angular.element(template[0].querySelector('.pie-chart'));
      expect(chart.length).to.eq(1); // Element exist on DOM
    });

  });

  describe('Component', () => {
    // component/directive specs
    let component = PieChartComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(PieChartTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(PieChartController);
    });
  });
});
