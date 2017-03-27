import CheckboxModule from './checkbox';
import CheckboxController from './checkbox.controller';
import CheckboxComponent from './checkbox.component';
import CheckboxTemplate from './checkbox.html';

describe('Checkbox', () => {
  let $rootScope, $componentController, $compile;
  let FORM_NAME_PREFIX;

  let blockBinding = require('app/mockBackEndResponse/potentialife-course_cycle-3_module-31_step-2.json').blocks[7];

  beforeEach(window.module(CheckboxModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    FORM_NAME_PREFIX = $injector.get('FORM_NAME_PREFIX');
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

      controller.$onInit();
    });

    it('has initialised text with the correct value', () => {
      expect(controller.text).to.equal(bindings.block.data.value);
    });

    it('has initialised formName with the correct value', () => {
      expect(controller.formName).to.equal(`${FORM_NAME_PREFIX}${bindings.block.id}`);
    });

    it('has toggleMore() which shows all items', () => {
      controller.toggleMore();
      expect(controller.showingMore).to.eq(true);
    });

    it('has toggleMore() and second time which shows less items', () => {
      controller.showingMore = true;
      controller.toggleMore();
      expect(controller.showingMore).to.eq(false);
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
      let labelText = angular.element(template[0].querySelector('.checkbox-label span'));
      expect(labelText.html()).to.eq(obj[0].label);
    });

    it('has a list item with the correct data in the input=value', () => {
      let obj = blockBinding.data.items;
      expect(template.find('input').attr('value')).to.eq(obj[0].value);
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
