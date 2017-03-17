import CheckboxModule from './checkbox';
import CheckboxController from './checkbox.controller';
import CheckboxComponent from './checkbox.component';
import CheckboxTemplate from './checkbox.html';

describe('Checkbox', () => {
  let $rootScope, $componentController, $compile;

  let blockBinding = require('app/mockBackEndResponse/potentialife-course_cycle-1_module-1_step-2.json').blocks[13];

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
      template = $compile('<checkbox on-update="$ctrl.updateInputFields(block.program_data_code, value)" is-top-level-form-submitted="topLevelForm.$submitted" block="block"></checkbox>')(scope);
      scope.$apply();
    });


    it('has the correct id on the form', () => {
      expect(template.find('ng-form').attr('id')).to.eq(blockBinding.data.name);
    });

    it('has a list item with the correct data in the label', () => {
      let obj = blockBinding.data.items;
      let labelText = angular.element(template[0].querySelector('.checkbox-label'));
      expect(labelText.html()).to.eq(obj[Object.keys(obj)[0]]);
    });

    it('has a list item with the correct data in the input=value', () => {
      let obj = blockBinding.data.items;
      expect(template.find('input').attr('value')).to.eq(obj[Object.keys(obj)[0]]);
    });
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
