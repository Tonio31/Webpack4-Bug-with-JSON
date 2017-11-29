import LineChartModule from './lineChart';
import LineChartController from './lineChart.controller';
import LineChartComponent from './lineChart.component';
import LineChartTemplate from './lineChart.html';

describe('LineChart', () => {
  let $rootScope, $componentController, $compile;

  let dataBindings = {
    id: 1032,
    type: 'static',
    element: 'line_chart',
    program_data_code: '',
    data: {
      title: 'Line Chart Title',
      y_label_title: 'Label for Y',
      y_label_suffix: '%',
      y_min: 0,
      y_max: 100,
      x_column_names: [
        'LifeMap 1',
        'LifeMap 2',
        'LifeMap 3'
      ],
      lines: [
        {
          title: 'Sleep',
          color: 'red',
          values: [ 100, 40, 60 ]
        },
        {
          title: 'Work',
          color: 'blue',
          values: [ 60, 70, 95 ]
        }
      ]
    }
  };


  beforeEach(window.module(LineChartModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
  }));

  describe('Controller', () => {
    // controller specs
    let controller;

    let bindings = {
      block: dataBindings
    };

    beforeEach(() => {
      controller = $componentController('lineChart', {
        $scope: $rootScope.$new()
      }, bindings);
    });


    it('formatYLabel adds y_label_suffix to all labels', () => {
      expect(controller.formatYLabel(10)).to.eq(`10${dataBindings.data.y_label_suffix}`);

    });

    it('$onInit creates the data needed for displaying the line chart', () => {

      controller.$onInit();

      expect(controller.chartColumns).to.deep.eq([
        {
          id: controller.xLabels
        },
        {
          id: 'Sleep',
          name: 'Sleep',
          color: 'red',
          type: 'line'
        },
        {
          id: 'Work',
          name: 'Work',
          color: 'blue',
          type: 'line'
        }
      ]);

      expect(controller.chartData).to.deep.eq( [
        {
          'pl2-x-label': 'LifeMap 1',
          'Sleep': 100,
          'Work': 60
        },
        {
          'pl2-x-label': 'LifeMap 2',
          'Sleep': 40,
          'Work': 70
        },
        {
          'pl2-x-label': 'LifeMap 3',
          'Sleep': 60,
          'Work': 95
        },
      ] );
    });

  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = dataBindings;
      template = $compile('<div><line-chart block="block"></line-chart></div>')(scope);
      scope.$apply();
    });


    it('has a p title', () => {
      expect(template.find('p').html()).to.eq(dataBindings.data.title);
    });

  });

  describe('Component', () => {
    // component/directive specs
    let component = LineChartComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(LineChartTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(LineChartController);
    });
  });
});
