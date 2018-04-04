import ComposedModule from './composed';
import ComposedController from './composed.controller';
import ComposedComponent from './composed.component';
import ComposedTemplate from './composed.html';

describe('Composed', () => {
  let $rootScope;
  // let $componentController;
  let $compile;

  let blockBinding = {
    type: 'composed',
    element: 'container',
    data: {
      blocks:[
        {
          id: 50,
          type: 'static',
          element: 'icon_text',
          data: {
            icon: {
              type: 'icon-pl-lock',
              color: 'success'
            },
            text: '<h1>This content is locked!</p>',
            button: {
              href: '/potentialife-course/cycle-1/module-1/step-9',
              color: 'primary',
              label: 'Resume your progress'
            }
          }
        },
        {
          id: 56,
          type: 'static',
          element: 'bar_chart',
          data: {
            title: 'Your strengths breakdown',
            bars: [
              {
                title: 'Work',
                color: 'blue',
                value: 25
              },
              {
                title: 'Whatever',
                color: 'red',
                value: 75
              }
            ]
          }
        }
      ]
    }
  };

  beforeEach(window.module(ComposedModule));

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
  //     controller = $componentController('composed', {
  //       $scope: $rootScope.$new()
  //     });
  //   });
  //
  //
  //   it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
  //   });
  // });

  describe('View', () => {
    // view specs
    let scope;
    let template;


    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = blockBinding;
      template = $compile('<composed block="block" />')(scope);
      scope.$apply();
    });

    it('has the correct amount of block as per the data', () => {
      const blockElements = angular.element(template[0].querySelectorAll('.composed > div'));
      const blockData = blockBinding.data.blocks.length;
      expect(blockElements.length).to.eq(blockData);
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = ComposedComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(ComposedTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(ComposedController);
    });
  });
});
