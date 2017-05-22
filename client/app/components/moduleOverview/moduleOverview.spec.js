import ModuleOverviewModule from './moduleOverview';
import ModuleOverviewController from './moduleOverview.controller';
import ModuleOverviewComponent from './moduleOverview.component';
import ModuleOverviewTemplate from './moduleOverview.html';

describe('ModuleOverview', () => {
  let $rootScope;
  // let $componentController;
  let $compile;

  let blockBinding = {
    id: 11,
    type: 'static',
    element: 'module_overview',
    data: {
      title: 'Module 1 - Overview',
      steps: [
        {
          title: 'Step 1',
          name: 'Module introduction',
          description: '2 minutes',
          status: 'completed'
        },
        {
          title: 'Step 2',
          name: 'Reflect on times you were at your best',
          description: '10 minutes',
          status: 'completed'
        },
        {
          title: 'Step 3',
          name: 'Exercise: Your strengths and weaknesses - part 1',
          description: '5 minutes',
          status: 'completed'
        },
        {
          title: 'Step 4',
          name: 'Exercise: Your strengths and weaknesses - part 2',
          description: '5 minutes',
          status: 'completed'
        },
        {
          title: 'Step 5',
          name: 'Video: Managing your weaknesses',
          description: '3 minutes',
          status: 'completed'
        },
        {
          title: 'Step 6',
          name: 'Exercise: How often are you using your strengths?',
          description: '3 minutes',
          status: 'completed'
        },
        {
          title: 'Step 7',
          name: 'Exercise: The VIA strengths diagnostic',
          description: '12 mins',
          status: 'completed'
        },
        {
          title: 'Step 8',
          name: 'Exercise: When are you playing to your strengths?',
          description: '3 minutes',
          status: 'completed'
        },
        {
          title: 'Step 9',
          name: 'Video: Module summary',
          description: '3 minutes',
          status: 'current'
        },
        {
          title: 'Step 10',
          name: 'Your module actions',
          description: '3 minutes',
          status: 'locked'
        },
        {
          title: 'Step 11',
          name: 'Hakunamatata',
          description: '20 minutes',
          status: 'locked'
        },
        {
          title: 'Step 12',
          name: 'Enjoy your life',
          description: '25 minutes',
          status: 'locked'
        }
      ]
    }
  };

  beforeEach(window.module(ModuleOverviewModule));

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
  //     block: blockBinding
  //   };
  //
  //   beforeEach(() => {
  //     controller = $componentController('moduleOverview', {
  //       $scope: $rootScope.$new()
  //     }, bindings);
  //   });
  //
  // });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = blockBinding;
      template = $compile('<module-overview block="block"></module-overview>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('Module 1 - Overview');
    });

    it('has a list item with the correct data in the label', () => {
      let obj = blockBinding.data.steps;
      let labelText = angular.element(template[0].querySelector('.h4-style'));
      expect(labelText.html()).to.eq(obj[Object.keys(obj)[0]].title);
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = ModuleOverviewComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(ModuleOverviewTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(ModuleOverviewController);
    });
  });
});
