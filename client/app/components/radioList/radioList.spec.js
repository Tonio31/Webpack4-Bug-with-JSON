import RadioListModule from './radioList';
import RadioListController from './radioList.controller';
import RadioListComponent from './radioList.component';
import RadioListTemplate from './radioList.html';

describe('RadioList', () => {
  let $rootScope, $componentController, $compile;
  let FORM_NAME_PREFIX, ICON_FONTELLO;

  let blockBinding = require('app/mockBackEndResponse/potentialife-course_cycle-1_module-1_step-2.json').blocks[14];

  beforeEach(window.module(RadioListModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    FORM_NAME_PREFIX = $injector.get('FORM_NAME_PREFIX');
    ICON_FONTELLO = $injector.get('ICON_FONTELLO');
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

    it('has the correct id on the form', () => {
      expect(template.find('ng-form').attr('id')).to.eq(blockBinding.data.name);
    });

    it('has a list item with the correct data in the label and input=value', () => {
      expect(template.find('li span').html()).to.eq(blockBinding.data.items[0]);
      expect(template.find('[type="checkbox"]').attr('value')).to.eq(blockBinding.data.items[0]);
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
