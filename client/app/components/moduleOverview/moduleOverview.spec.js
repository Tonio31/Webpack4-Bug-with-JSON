import ModuleOverviewModule from './moduleOverview';
import ModuleOverviewController from './moduleOverview.controller';
import ModuleOverviewComponent from './moduleOverview.component';
import ModuleOverviewTemplate from './moduleOverview.html';

describe('ModuleOverview', () => {
  let $rootScope, $componentController, $compile;

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
    beforeEach(() => {
      controller = $componentController('moduleOverview', {
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
      template = $compile('<moduleOverview></moduleOverview>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('moduleOverview');
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
