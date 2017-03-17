import TextAreaModule from './textArea';
import TextAreaController from './textArea.controller';
import TextAreaComponent from './textArea.component';
import TextAreaTemplate from './textArea.html';

describe('TextArea', () => {
  let $rootScope, $componentController, $compile;
  let FORM_NAME_PREFIX, ICON_FONTELLO;

  let blockBinding = require('app/mockBackEndResponse/potentialife-course_cycle-1_module-1_step-2.json').blocks[3];

  beforeEach(window.module(TextAreaModule));

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
      controller = $componentController('plTextArea', {
        $scope: $rootScope.$new()
      }, bindings);

      controller.$onInit();
    });


    it('has initialise text & formName with the good value', () => {
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
      template = $compile('<pl-text-area block="block" is-top-level-form-submitted="isTopLevelFormSubmitted"></pl-text-area>')(scope);
      scope.$apply();
    });


    it('has a h3 title', () => {
      expect(template.find('h3').html()).to.eq(blockBinding.data.label);
    });

    it('has a textarea with properties', () => {
      let textAreaTag = template.find('textarea');
      expect(textAreaTag.html().trim()).to.eq(blockBinding.data.value);
      expect(textAreaTag.hasClass('parent-submitted')).to.eq(true);
      expect(textAreaTag.attr('ng-attr-placeholder')).to.eq('{{$ctrl.block.data.placeholder}}');
    });

  });

  describe('Component', () => {
    // component/directive specs
    let component = TextAreaComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(TextAreaTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(TextAreaController);
    });
  });
});
