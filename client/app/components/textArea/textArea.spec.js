import TextAreaModule from './textArea';
import TextAreaController from './textArea.controller';
import TextAreaComponent from './textArea.component';
import TextAreaTemplate from './textArea.html';

describe('TextArea', () => {
  let $rootScope, $componentController, $compile;
  let Utility;
  let FORM_NAME_PREFIX;

  let blockBinding = {
    id: 31,
    type: 'dynamic',
    element: 'textarea',
    program_data_code: 'c1.m1.s1.story_1',
    required: true,
    data: {
      config: {
        class: 'large-height',
        required: true
      },
      label: 'Label: Story 1:',
      placeholder: 'placeholder: Please fill in the first story',
      value: 'Something',
      name: 'name: story_1'
    }
  };

  beforeEach(window.module(TextAreaModule));

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
      controller = $componentController('plTextArea', {
        $scope: $rootScope.$new()
      }, bindings);

      updateBlockManagerSpy = sinon.spy(controller, 'updateBlockManager');
    });


    it('$onInit() - initialise text & FORM_NAME from the input', () => {
      controller.$onInit();
      expect(controller.text).to.equal(bindings.block.data.value);
      expect(controller.FORM_NAME).to.equal(`${FORM_NAME_PREFIX}${bindings.block.id}`);

      sinon.assert.callCount(updateBlockManagerSpy, 0);
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
      template = $compile('<pl-text-area block="block" is-top-level-form-submitted="isTopLevelFormSubmitted"></pl-text-area>')(scope);
      scope.$apply();
    });


    it('has a h3 title', () => {
      let labelText = angular.element(template[0].querySelector('h3 label'));
      expect(labelText.html()).to.eq(blockBinding.data.label);
    });

    it('textarea Tag has the class from bindings when it is specified in input', () => {
      let textAreaTag = angular.element(template[0].querySelector('textarea'));
      expect(textAreaTag.hasClass(blockBinding.data.config.class)).to.eq(true);
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
