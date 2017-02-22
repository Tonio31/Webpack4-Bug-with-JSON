import <%= upCaseName %>Module from './<%= name %>'
import <%= upCaseName %>Controller from './<%= name %>.controller';
import <%= upCaseName %>Component from './<%= name %>.component';
import <%= upCaseName %>Template from './<%= name %>.html';

describe('<%= upCaseName %>', () => {
  let $rootScope, $componentController, $compile;

  beforeEach(window.module(<%= upCaseName %>Module));

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
      controller = $componentController('<%= name %>', {
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
      template = $compile('<<%= name %>></<%= name %>>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('<%= name %>');
    });
  });

  describe('Component', () => {
      // component/directive specs
      let component = <%= upCaseName %>Component;

      it('includes the intended template',() => {
        expect(component.template).to.equal(<%= upCaseName %>Template);
      });

      it('invokes the right controller', () => {
        expect(component.controller).to.equal(<%= upCaseName %>Controller);
      });
  });
});
