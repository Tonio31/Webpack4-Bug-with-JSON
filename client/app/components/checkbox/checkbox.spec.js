import CheckboxModule from './checkbox';
import CheckboxController from './checkbox.controller';
import CheckboxComponent from './checkbox.component';
import CheckboxTemplate from './checkbox.html';

describe('Checkbox', () => {
  let $rootScope, $componentController, $compile;

  beforeEach(window.module(CheckboxModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    beforeEach(() => {
      controller = $componentController('checkbox', {
        $scope: $rootScope.$new()
      });
    });


    it('has a name property [REMOVE]', () => { // erase if removing this.name from the controller
      expect(controller).to.have.property('name');
    });
  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<checkbox></checkbox>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('checkbox');
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
