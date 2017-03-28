import TextBoxModule from './textBox';
import TextBoxController from './textBox.controller';
import TextBoxComponent from './textBox.component';
import TextBoxTemplate from './textBox.html';

describe('TextBox', () => {
  let $rootScope, $componentController, $compile;
  let FORM_NAME_PREFIX, ICON_FONTELLO;

  let blockBinding = require('app/mockBackEndResponse/potentialife-course_cycle-3_module-31_step-2.json').blocks[3];


  beforeEach(window.module(TextBoxModule));

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
      controller = $componentController('textBox', {
        $scope: $rootScope.$new()
      }, bindings);

      controller.$onInit();
    });


    it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
      expect(controller.text).to.equal(bindings.block.data.value);
      expect(controller.formName).to.equal(`${FORM_NAME_PREFIX}${bindings.block.id}`);
      expect(controller.iconText).to.equal(ICON_FONTELLO.VALID_TICK);
    });
  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = blockBinding;
      scope.isTopLevelFormSubmitted = true;
      template = $compile('<text-box block="block" is-top-level-form-submitted="isTopLevelFormSubmitted"></text-box>')(scope);
      scope.$apply();
    });


    it('has a h3 title', () => {
      expect(template.find('h3').html()).to.eq(blockBinding.data.label);
    });

    it('has a input with properties', () => {
      let textAreaTag = template.find('input');
      expect(textAreaTag.val()).to.eq(blockBinding.data.value);
      expect(textAreaTag.hasClass('parent-submitted')).to.eq(true);
      expect(textAreaTag.attr('ng-attr-placeholder')).to.eq('{{$ctrl.block.data.placeholder}}');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = TextBoxComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(TextBoxTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(TextBoxController);
    });
  });
});
