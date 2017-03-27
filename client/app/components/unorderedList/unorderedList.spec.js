import UnorderedListModule from './unorderedList';
import UnorderedListController from './unorderedList.controller';
import UnorderedListComponent from './unorderedList.component';
import UnorderedListTemplate from './unorderedList.html';

describe('UnorderedList', () => {
  let $rootScope;
  // let $componentController;
  let $compile;

  let blockBinding = require('app/mockBackEndResponse/potentialife-course_cycle-3_module-31_step-6.json').blocks[1];

  beforeEach(window.module(UnorderedListModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    // $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
  }));

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.block = blockBinding;
      template = $compile('<unordered-list block="block"/>')(scope);
      scope.$apply();
    });

    it('has a list item with the correct data in the text', () => {
      let obj = blockBinding.data.items;
      let listItem = angular.element(template[0].querySelector('li .list-wrap'));
      expect(listItem.html()).to.eq(obj[0]);
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
