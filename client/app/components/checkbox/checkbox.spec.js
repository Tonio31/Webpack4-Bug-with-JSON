import CheckboxModule from './checkbox';
import CheckboxController from './checkbox.controller';
import CheckboxComponent from './checkbox.component';
import CheckboxTemplate from './checkbox.html';

describe('Checkbox', () => {
  let $rootScope, $componentController, $compile;
  let Utility;
  let FORM_NAME_PREFIX;

  let blockBinding = {
    id: 52,
    type: 'dynamic',
    element: 'checkbox',
    program_data_code: 'c1.m1.s1.checkbox_1',
    data: {
      config: {
        min_selected: 2,
        max_selected: 3
      },
      label: 'this is the label',
      placeholder: 'this is the placholder',
      name: 'this is the name',
      items: [
        {
          label: 'label: Meeting with Con',
          sub_label: 'sub_label: non-work',
          value: 'Con',
          checked: false,
          feedback: 'this answer has feedback'
        },
        {
          label: 'label: Meeting with Dan1',
          value: 'dan1',
          checked: false,
          feedback: 'this answer has feedback'
        },
        {
          label: 'label: Meeting with an Alien2',
          value: 'alien2',
          checked: false,
          feedback: 'this answer has feedback'
        },
        {
          label: 'label: Meeting with my bed3',
          value: 'bed3',
          checked: false,
          feedback: 'this answer has feedback'
        },
        {
          label: 'label: Meeting with Dan4',
          value: 'dan4',
          checked: false,
          feedback: 'this answer has feedback'
        },
        {
          label: 'label: Meeting with an Alien5',
          value: 'alien5',
          checked: false,
          feedback: 'this answer has feedback'
        },
        {
          label: 'label: Meeting with my bed6',
          value: 'bed6',
          checked: false,
          feedback: 'this answer has feedback'
        },
        {
          label: 'label: Meeting with Dan7',
          value: 'dan7',
          checked: false
        },
        {
          label: 'label: Meeting with an Alien8',
          value: 'alien8',
          checked: true
        },
        {
          label: 'label: Meeting with my bed9',
          value: 'bed9',
          checked: false
        }
      ]
    },
    pivot: {
      step_id: 6,
      block_id: 62
    }
  };


  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(CheckboxModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
  }));

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


    beforeEach(() => {
      let bindings = {
        block: blockBinding,
        isTopLevelFormSubmitted: false,
        updateBlockManager: () => {}
      };

      controller = $componentController('checkbox', {
        $scope: $rootScope.$new()
      }, bindings);


      updateBlockManagerSpy = sinon.spy(controller, 'updateBlockManager');

    });

    it('$onInit() - constant are initialised', () => {
      controller.$onInit();
      expect(controller.FORM_NAME).to.equal(`${FORM_NAME_PREFIX}${controller.block.id}`);
      expect(controller.CHECKBOX_GROUP_NAME).to.equal(`checkbox_group-${controller.FORM_NAME}`);
      expect(controller.NB_MIN_CHECKBOX_SELECTED).to.equal(blockBinding.data.config.min_selected);
      expect(controller.NB_MAX_CHECKBOX_SELECTED).to.equal(blockBinding.data.config.max_selected);
    });


    it('$onInit() - this.selection is initialised from input data if input have checked checkbox', () => {

      // Choosing the item number 8 will cause displayAllCheckbox() to be called
      controller.block.data.items[8].checked = true;

      controller.$onInit();

      expect(controller.areAllCheckBoxDisplayed).to.equal(true);
      expect(controller.limit).to.equal(undefined);
      expect(controller.selection).to.deep.equal({ alien8: true });

      // Revert the change to don't impact other test
      controller.block.data.items[8].checked = false;
    });


    it('$onInit() - this.selection is initialised from localStorage  if input DOESN\'T have checked checkbox', sinon.test( () => {

      let getUserInputFromLocalStorageStub = sinon.stub(Utility, 'getUserInputFromLocalStorage', () => {
        return ['dan'];
      });


      controller.$onInit();

      expect(controller.areAllCheckBoxDisplayed).to.equal(true);
      expect(controller.limit).to.equal(undefined);
      expect(controller.selection).to.deep.equal({ dan: true });

      sinon.assert.calledWith(getUserInputFromLocalStorageStub, controller.block.program_data_code);
      sinon.assert.calledWith(updateBlockManagerSpy, { blockManagerValue: ['dan'] });

    }));

    it('getPleaseSelectMessage() for min=max=1', () => {
      expect(controller.getPleaseSelectMessage(1, 1)).to.equal('PLEASE_SELECT_1_OPTION');
    });

    it('getPleaseSelectMessage() for min=max=2', () => {
      expect(controller.getPleaseSelectMessage(2, 2)).to.equal('PLEASE_SELECT_X_OPTIONS');
    });

    it('getPleaseSelectMessage() for min=2 max=4', () => {
      expect(controller.getPleaseSelectMessage(2, 4)).to.equal('PLEASE_SELECT_RANGE_OPTIONS');
    });

    it('checkIfValid() returns false if the number of checkbox checked is not less than min', () => {
      controller.NB_MIN_CHECKBOX_SELECTED = 2;

      // Only 1 checked
      controller.selection = {
        dan: true
      };

      let oListChecked = [];

      let isValid = controller.checkIfValid(oListChecked);
      expect(isValid).to.eq(false);
      expect(oListChecked).to.deep.eq([ 'dan' ]);
    });

    it('checkIfValid() returns false if the number of checkbox checked is not more than max', () => {
      controller.NB_MAX_CHECKBOX_SELECTED = 1;

      // Only 1 checked
      controller.selection = {
        dan: true,
        alien: true
      };

      let oListChecked = [];

      let isValid = controller.checkIfValid(oListChecked);
      expect(isValid).to.eq(false);
      expect(oListChecked).to.deep.eq([ 'dan', 'alien' ]);
    });

    it('checkIfValid() returns true if the number of checkbox checked is not between min and max', () => {
      controller.NB_MIN_CHECKBOX_SELECTED = 2;
      controller.NB_MAX_CHECKBOX_SELECTED = 2;

      // Simulate 2 checked
      controller.selection = {
        dan: true,
        alien: true
      };

      let oListChecked = [];

      let isValid = controller.checkIfValid(oListChecked);
      expect(isValid).to.eq(true);
      expect(oListChecked).to.deep.eq([ 'dan', 'alien' ]);
    });

    it('actionOnUserInput() will set the HTML input element to VALID and call updateBlockManager()', sinon.test( () => {
      controller.NB_MIN_CHECKBOX_SELECTED = 2;
      controller.NB_MAX_CHECKBOX_SELECTED = 2;

      // Simulate 2 checked
      controller.selection = {
        dan: true,
        alien: true
      };

      let checkBoxGroupElement = {
        $setValidity: () => {}
      };

      let $setValiditySpy = sinon.spy(checkBoxGroupElement, '$setValidity');

      controller.actionOnUserInput(checkBoxGroupElement);

      sinon.assert.calledWith($setValiditySpy, 'nbOptionSelected', true);
      sinon.assert.calledWith(updateBlockManagerSpy, { blockManagerValue: ['dan', 'alien'] });
    }));

    it('actionOnUserInput() will set the HTML input element to INVALID and call updateBlockManager()', sinon.test( () => {
      controller.NB_MIN_CHECKBOX_SELECTED = 2;
      controller.NB_MAX_CHECKBOX_SELECTED = 2;

      // Only 1 checked
      controller.selection = {
        dan: true
      };

      let checkBoxGroupElement = {
        $setValidity: () => {}
      };

      let $setValiditySpy = sinon.spy(checkBoxGroupElement, '$setValidity');

      controller.actionOnUserInput(checkBoxGroupElement);

      sinon.assert.calledWith($setValiditySpy, 'nbOptionSelected', false);
      sinon.assert.calledWith(updateBlockManagerSpy, { blockManagerValue: ['dan'] });
    }));


  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = blockBinding;
      scope.isTopLevelFormSubmitted = true;
      template = $compile('<checkbox is-top-level-form-submitted="isTopLevelFormSubmitted" block="block"></checkbox>')(scope);
      scope.$apply();
    });


    it('has the correct id on the form', () => {
      expect(template.find('ng-form').attr('id')).to.eq(`${FORM_NAME_PREFIX}${blockBinding.id}`);
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

    it('Display all checkbox when clicking on ShowMore', () => {
      // Click on Show More
      let showMoreButton = angular.element(template[0].querySelector('.list-footer button'));
      showMoreButton.triggerHandler('click');
      scope.$apply();

      // Now the list starts at the first element in the obj array
      let checkboxes = angular.element(template[0].querySelectorAll('input'));
      expect(checkboxes.length).to.eq(10);
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
