import BlockManagerModule from './blockManager';
import BlockManagerController from './blockManager.controller';
import BlockManagerComponent from './blockManager.component';
import BlockManagerTemplate from './blockManager.html';

describe('BlockManager', () => {
  let $rootScope;
  // let $componentController;
  // let $compile;

  beforeEach(window.module(BlockManagerModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    // $componentController = $injector.get('$componentController');
    // $compile = $injector.get('$compile');
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
    let scope;
    // let template;

    beforeEach(() => {
      scope = $rootScope.$new();
      // template = $compile('<block-manager></block-manager>')(scope);
      scope.$apply();
    });


    // it('has a h1 title', () => {
    //   expect(template.find('h1').html()).to.eq('blockManager');
    // });
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
