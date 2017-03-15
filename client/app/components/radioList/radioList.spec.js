import RadioListModule from './radioList';
import RadioListController from './radioList.controller';
import RadioListComponent from './radioList.component';
import RadioListTemplate from './radioList.html';

describe('RadioList', () => {
  let $rootScope, $componentController, $compile;

  let blockBinding = require('app/mockBackEndResponse/potentialife-course_cycle-1_module-1_step-2.json').blocks[3];

  beforeEach(window.module(RadioListModule));

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
      block: blockBinding,
      isTopLevelFormSubmitted: false
    };

    beforeEach(() => {
      controller = $componentController('radioList', {
        $scope: $rootScope.$new()
      }, bindings);
    });

    controller.$onInit();
  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = blockBinding;
      scope.isTopLevelFormSubmitted = true;
      template = $compile('<radioList></radioList>')(scope);
      scope.$apply();
    });


    it('has a radioList', () => {
      expect(template.find('p.note').html()).to.eq('(Please select 1 option below)');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = RadioListComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(RadioListTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(RadioListController);
    });
  });
});
