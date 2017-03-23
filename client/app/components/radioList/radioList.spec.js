import RadioListModule from './radioList';
import RadioListController from './radioList.controller';
import RadioListComponent from './radioList.component';
import RadioListTemplate from './radioList.html';

describe('RadioList', () => {
  let $rootScope, $componentController, $compile;
  let FORM_NAME_PREFIX;

  let blockBinding = require('app/mockBackEndResponse/potentialife-course_cycle-1_module-1_step-2.json').blocks[14];

  beforeEach(window.module(RadioListModule));

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
      controller = $componentController('radioList', {
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

    it('has toggleMore() which shows less, with items before and after the selected item', () => {
      controller.showingMore = true;
      controller.listIndex = 12;
      controller.toggleMore();
      expect(controller.limitStart).to.eq(10);
    });

  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = blockBinding;
      scope.isTopLevelFormSubmitted = true;
      template = $compile('<radio-list on-update="$ctrl.updateInputFields(block.program_data_code, value)" is-top-level-form-submitted="topLevelForm.$submitted" block="block"></radio-list>')(scope);
      scope.$apply();
    });

    it('has the correct id on the form 12', () => {
      expect(template.find('ng-form').attr('id')).to.eq(blockBinding.data.name);
    });

    it('has a list item with the correct data in the label', () => {
      let obj = blockBinding.data.items;
      let labelText = angular.element(template[0].querySelector('.radio-label'));
      expect(labelText.html()).to.eq(obj[0].label);
    });

    it('has a list item with the correct data in the input=value', () => {
      let obj = blockBinding.data.items;
      expect(template.find('input').attr('value')).to.eq(obj[0].value);
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
