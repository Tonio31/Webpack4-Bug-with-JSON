import UnorderedListModule from './unorderedList';
import UnorderedListController from './unorderedList.controller';
import UnorderedListComponent from './unorderedList.component';
import UnorderedListTemplate from './unorderedList.html';

describe('UnorderedList', () => {
  let $rootScope;
  let $componentController;
  let $compile;

  let blockBinding =
    {
      id: 67,
      type: 'static',
      element: 'ul',
      program_data_code: 'c3.m1.s1.ul_1',
      data: {
        config: {
          minItemsDisplayed: 0,
          showMoreButtonAtStart: true
        },
        name: 'Your chosen VIA character strengths',
        items: [
          {
            label: 'Power',
            sub_label: 'Sub Label',
            takeaways: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          },
          {
            label: 'Reflexion',
            sub_label: 'Sub Label',
            takeaways: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          },
          {
            label: 'Love',
            sub_label: 'Sub Label',
            takeaways: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          },
          {
            label: 'Good in Bed',
            sub_label: 'Sub Label',
            takeaways: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          },
          {
            label: 'Hakunamatata',
            sub_label: 'Sub Label',
            takeaways: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          },
          {
            label: 'Mars',
            sub_label: 'Sub Label',
            takeaways: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          },
          {
            label: 'Sun',
            sub_label: 'Sub Label',
            takeaways: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          },
          {
            label: 'Hate',
            sub_label: 'Sub Label',
            takeaways: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'
          }
        ]
      }
    };

  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(UnorderedListModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
  }));


  describe('Controller', () => {
    // controller specs
    let controller;

    beforeEach(() => {
      let bindings = {
        block: blockBinding
      };

      controller = $componentController('unorderedList', {
        $scope: $rootScope.$new()
      }, bindings);

    });

    it('$onInit() - constant are initialised when MIN_ELEMENTS_DISPLAYED=0', () => {
      controller.$onInit();
      expect(controller.MIN_ELEMENTS_DISPLAYED).to.equal(0);
      expect(controller.showMoreButtonDisplayed).to.equal(true);
      expect(controller.limit).to.equal(controller.MIN_ELEMENTS_DISPLAYED);
      expect(controller.showMoreLabel).to.equal('SHOW');
      expect(controller.hideLabel).to.equal('HIDE');
    });

    it('$onInit() - constant are initialised when MIN_ELEMENTS_DISPLAYED != 0', () => {

      // Faking other input data
      controller.block.data.config.minItemsDisplayed = 5;

      controller.$onInit();
      expect(controller.MIN_ELEMENTS_DISPLAYED).to.equal(5);
      expect(controller.showMoreButtonDisplayed).to.equal(true);
      expect(controller.limit).to.equal(controller.MIN_ELEMENTS_DISPLAYED);
      expect(controller.showMoreLabel).to.equal('SHOW_MORE');
      expect(controller.hideLabel).to.equal('SHOW_LESS');
    });

    it('$onInit() - constant are initialised', () => {
      controller.$onInit();
      expect(controller.MIN_ELEMENTS_DISPLAYED).to.equal(5);
      expect(controller.showMoreButtonDisplayed).to.equal(true);
      expect(controller.limit).to.equal(controller.MIN_ELEMENTS_DISPLAYED);
    });


    it('toggleMore() modify controller.limit', () => {
      controller.$onInit();
      controller.toggleMore();
      expect(controller.showMoreButtonDisplayed).to.equal(false);
      expect(controller.limit).to.equal(undefined);

      controller.toggleMore();
      expect(controller.showMoreButtonDisplayed).to.equal(true);
      expect(controller.limit).to.equal(controller.MIN_ELEMENTS_DISPLAYED);
    });


  });


  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = blockBinding;
      template = $compile('<unordered-list block="block"/>')(scope);
      scope.$apply();
    });

    it('has a list item with the correct data in the label', () => {
      let obj = blockBinding.data.items;
      let listItem = angular.element(template[0].querySelector('li .list-wrap p'));
      expect(listItem.html()).to.eq(obj[0].label);
    });

    it('has a list item with the correct data in the sub_label', () => {
      let obj = blockBinding.data.items;
      let listItem = angular.element(template[0].querySelector('li .list-wrap span'));
      expect(listItem.html()).to.contain(obj[0].sub_label);
    });

    it('has a list item with the correct data in the takeaways', () => {
      let obj = blockBinding.data.items;
      let listItem = angular.element(template[0].querySelector('li .takeaways .takeaway.fgcolour-active'));
      expect(listItem.html()).to.eq(obj[0].takeaways);
    });

    it('has a correct number of items displayed', () => {
      let listItems = angular.element(template[0].querySelectorAll('li .list-wrap'));
      expect(listItems.length).to.eq(5);

      let showMoreButton = angular.element(template[0].querySelector('.list-footer button'));
      showMoreButton.triggerHandler('click');
      scope.$apply();

      listItems = angular.element(template[0].querySelectorAll('li .list-wrap'));
      expect(listItems.length).to.eq(blockBinding.data.items.length);
    });

  });

  describe('Component', () => {
    // component/directive specs
    let component = UnorderedListComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(UnorderedListTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(UnorderedListController);
    });
  });
});
