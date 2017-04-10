import TextBoxModule from './textBox';
import TextBoxController from './textBox.controller';
import TextBoxComponent from './textBox.component';
import TextBoxTemplate from './textBox.html';

describe('TextBox', () => {
  let $rootScope, $componentController, $compile;
  let Utility;
  let FORM_NAME_PREFIX;

  let blockBinding = {
    id: 31,
    type: 'dynamic',
    element: 'textarea',
    program_data_code: 'c1.m1.s1.textbox_1',
    required: true,
    data: {
      label: 'Label: This is the label for the text box common_theme_1',
      placeholder: 'placeholder: Enter some data here',
      value: 'Something',
      name: 'common_theme_1'
    }
  };


  beforeEach(window.module(TextBoxModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    FORM_NAME_PREFIX = $injector.get('FORM_NAME_PREFIX');
    Utility = $injector.get('Utility');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;

    let updateBlockManagerSpy;

    let bindings = {
      block: blockBinding,
      isTopLevelFormSubmitted: false,
      updateBlockManager: () => {}
    };

    beforeEach(() => {
      controller = $componentController('textBox', {
        $scope: $rootScope.$new()
      }, bindings);

      updateBlockManagerSpy = sinon.spy(controller, 'updateBlockManager');
    });

    it('$onInit() - initialise text & FORM_NAME from the input', () => {
      controller.$onInit();
      expect(controller.text).to.equal(bindings.block.data.value);
      expect(controller.FORM_NAME).to.equal(`${FORM_NAME_PREFIX}${bindings.block.id}`);

      sinon.assert.notCalled(updateBlockManagerSpy);
    });

    it('$onInit() - initialise text & FORM_NAME from the local storage', () => {

      bindings.block.data.value = '';
      let getUserInputFromLocalStorageStub = sinon.stub(Utility, 'getUserInputFromLocalStorage', () => {
        return 'Some Text';
      });

      controller.$onInit();
      expect(controller.text).to.equal('Some Text');
      expect(controller.FORM_NAME).to.equal(`${FORM_NAME_PREFIX}${bindings.block.id}`);

      sinon.assert.calledWith(getUserInputFromLocalStorageStub, controller.block.program_data_code);
      sinon.assert.calledWith(updateBlockManagerSpy, { blockManagerValue: 'Some Text' });
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
      let labelText = angular.element(template[0].querySelector('h3 label'));
      expect(labelText.to.eq(blockBinding.data.label);
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
