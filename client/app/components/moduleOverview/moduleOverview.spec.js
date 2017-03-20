import ModuleOverviewModule from './moduleOverview';
import ModuleOverviewController from './moduleOverview.controller';
import ModuleOverviewComponent from './moduleOverview.component';
import ModuleOverviewTemplate from './moduleOverview.html';

describe('ModuleOverview', () => {
  let $rootScope, $componentController, $compile;
  let ICON_FONTELLO;

  let blockBinding = require('app/mockBackEndResponse/potentialife-course_cycle-1_module-1_step-1.json').blocks[1];

  beforeEach(window.module(ModuleOverviewModule));

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
      block: blockBinding
    };

    beforeEach(() => {
      controller = $componentController('moduleOverview', {
        $scope: $rootScope.$new()
      }, bindings);
    });

  });

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
