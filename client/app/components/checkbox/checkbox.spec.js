import CheckboxModule from './checkbox';
import CheckboxController from './checkbox.controller';
import CheckboxComponent from './checkbox.component';
import CheckboxTemplate from './checkbox.html';

describe('Checkbox', () => {
  let $rootScope, $componentController, $compile;

  let blockBinding = require('app/mockBackEndResponse/potentialife-course_cycle-1_module-1_step-2.json').blocks[3];

  beforeEach(window.module(CheckboxModule));

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
      controller = $componentController('checkbox', {
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
      scope.isTopLevelFormSubmitted = true;
      template = $compile('<checkbox></checkbox>')(scope);
      scope.$apply();
    });


    // it('has a checkbox', () => {
    //   expect(true).to.be.true;
    //   // expect(template.find('p.note').html()).to.eq('(Please select 1 option below)');
    // });
  });

  describe('Component', () => {
    // component/directive specs
    let component = CheckboxComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(CheckboxTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(CheckboxController);
    });
  });
});
