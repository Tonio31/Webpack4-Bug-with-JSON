import BlockManagerModule from './blockManager';
import BlockManagerController from './blockManager.controller';
import BlockManagerComponent from './blockManager.component';
import BlockManagerTemplate from './blockManager.html';

describe('BlockManager', () => {
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
        }
      ]
    }
  };

  beforeEach(window.module(BlockManagerModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    // $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    // let controller;
    // beforeEach(() => {
    //   controller = $componentController('blockManager', {
    //     $scope: $rootScope.$new()
    //   });
    // });

  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = blockBinding;
      scope.isTopLevelFormSubmitted = true;
      scope.updateParent = () => {};
      template = $compile('<block-manager block="block" is-top-level-form-submitted="isTopLevelFormSubmitted" update-parent="updateParent()"></block-manager>')(scope);
      scope.$apply();
    });

    it('has an element called \'module-overview\'', () => {
      let element = angular.element(template[0].querySelector('module-overview'));
      expect(element.length).to.eq(1);
    });

  });

  describe('Component', () => {
    // component/directive specs
    let component = BlockManagerComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(BlockManagerTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(BlockManagerController);
    });
  });
});
