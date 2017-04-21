import RadioListModule from './radioList';
import RadioListController from './radioList.controller';
import RadioListComponent from './radioList.component';
import RadioListTemplate from './radioList.html';

describe('RadioList', () => {
  let $rootScope, $componentController, $compile;
  let FORM_NAME_PREFIX;

  let blockBinding = {
    id: 63,
    type: 'dynamic',
    element: 'radiobox',
    program_data_code: 'c1.m1.s1.radio_1',
    data: {
      config: {
        required: true
      },
      label: 'this is the label',
      name: 'this is the name',
      items: [
        {
          label: 'this is the label 1',
          value: 'this_is_the_label_1',
          sub_label: null,
          selected: false,
          feedback: null
        },
        {
          label: 'this is the label 2',
          value: 'this_is_the_label_2',
          sub_label: null,
          selected: false,
          feedback: null
        },
        {
          label: 'this is the label 3',
          value: 'this_is_the_label_3',
          sub_label: null,
          selected: false,
          feedback: null
        },
        {
          label: 'this is the label 4',
          value: 'this_is_the_label_4',
          sub_label: null,
          selected: false,
          feedback: 'this answer has feedback'
        },
        {
          label: 'this is the label 5',
          value: 'this_is_the_label_5',
          sub_label: null,
          selected: false,
          feedback: 'This answer has feedback'
        },
        {
          label: 'this is the label 6',
          value: 'this_is_the_label_6',
          sub_label: null,
          selected: false,
          feedback: null
        },
        {
          label: 'this is the label 7',
          value: 'this_is_the_label_7',
          sub_label: null,
          selected: false,
          feedback: null
        },
        {
          label: 'this is the label 8',
          value: 'this_is_the_label_8',
          sub_label: null,
          selected: false,
          feedback: 'this answer has feedback'
        },
        {
          label: 'this is the label 9',
          value: 'this_is_the_label_9',
          sub_label: null,
          selected: false,
          feedback: null
        },
        {
          label: 'this is the label 10',
          value: 'this_is_the_label_10',
          sub_label: null,
          selected: false,
          feedback: null
        },
        {
          label: 'this is the label 11',
          value: 'this_is_the_label_11',
          sub_label: null,
          selected: false,
          feedback: null
        },
        {
          label: 'this is the label 12',
          value: 'this_is_the_label_12',
          sub_label: null,
          selected: false,
          feedback: null
        },
        {
          label: 'this is the label 13',
          value: 'this_is_the_label_13',
          sub_label: null,
          selected: false,
          feedback: null
        },
        {
          label: 'this is the label 14',
          value: 'this_is_the_label_14',
          sub_label: null,
          selected: true,
          feedback: 'this answer has feedback'
        },
        {
          label: 'this is the label 15',
          value: 'this_is_the_label_15',
          sub_label: null,
          selected: false,
          feedback: null
        }
      ]
    },
    pivot: {
      step_id: 6,
      block_id: 63
    }
  };

  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(RadioListModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
  }));

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

    it('Initialise selected value and limits', () => {
      expect(controller.selected).to.equal('this_is_the_label_14');
      expect(controller.limit).to.equal(5);
      expect(controller.limitStart).to.equal(-5);
    });

    it('Initialise FORM_NAME with the correct value', () => {
      expect(controller.FORM_NAME).to.equal(`${FORM_NAME_PREFIX}${bindings.block.id}`);
    });

    it('toggleMore() which shows all items', () => {
      controller.toggleMore();
      expect(controller.showMoreButtonDisplayed).to.eq(false);
      expect(controller.limit).to.equal(undefined);
      expect(controller.limitStart).to.equal(0);
    });

    it('toggleMore() and second time which shows less items', () => {
      controller.showMoreButtonDisplayed = false;
      controller.toggleMore();
      expect(controller.showMoreButtonDisplayed).to.eq(true);
      expect(controller.limit).to.equal(5);
      expect(controller.limitStart).to.equal(-5);
    });

    it('findSelectedIndex() return the index of the selected radiobox', () => {
      let indexSelected = 2;
      controller.selected = blockBinding.data.items[indexSelected].value;
      expect(controller.findSelectedIndex()).to.eq(indexSelected);
    });

    it('findSelectedIndex() return 0 if nothing is selected', () => {
      controller.selected = '';
      expect(controller.findSelectedIndex()).to.eq(0);
    });
  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = blockBinding;
      scope.isTopLevelFormSubmitted = true;
      template = $compile('<radio-list is-top-level-form-submitted="isTopLevelFormSubmitted" block="block"></radio-list>')(scope);
      scope.$apply();
    });

    it('has the correct id on the form 12', () => {
      expect(template.find('ng-form').attr('id')).to.eq(`${FORM_NAME_PREFIX}${blockBinding.id}`);
    });

    it('has a list item with the correct data in the label', () => {
      let labelText = angular.element(template[0].querySelector('.radio-label span'));
      expect(labelText.html()).to.eq(blockBinding.data.items[10].label);
    });

    it('has a list item with the correct data in the input=value', () => {
      expect(template.find('input').attr('value')).to.eq(blockBinding.data.items[10].value);
    });


    it('Change limitStart and see the change on the template', () => {
      // Click on Show More
      let showMoreButton = angular.element(template[0].querySelector('.list-footer button'));
      showMoreButton.triggerHandler('click');
      scope.$apply();

      // Now the list starts at the first element in the obj array
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
