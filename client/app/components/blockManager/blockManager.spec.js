import BlockManagerModule from './blockManager';
import BlockManagerController from './blockManager.controller';
import BlockManagerComponent from './blockManager.component';
import BlockManagerTemplate from './blockManager.html';

describe('BlockManager', () => {
  let $rootScope;
  // let $componentController;
  let $compile;
  let blockBinding = require('app/mockBackEndResponse/potentialife-course_cycle-3_module-31_step-1.json').blocks[1];

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
      template = $compile('<block-manager block="block" is-top-level-form-submitted="topLevelForm.$submitted" on-update="$ctrl.updateInputFields(block.program_data_code, value)"></block-manager>')(scope);
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
