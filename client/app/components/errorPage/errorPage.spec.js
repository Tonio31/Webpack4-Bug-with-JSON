import ErrorPageModule from './errorPage';
import ErrorPageController from './errorPage.controller';
import ErrorPageComponent from './errorPage.component';
import ErrorPageTemplate from './errorPage.html';

describe('ErrorPage', () => {
  let $rootScope, $componentController, $compile;

  beforeEach(window.module(ErrorPageModule));

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
      controller = $componentController('errorPage', {
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
      template = $compile('<error-page></error-page>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('errorPage');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = ErrorPageComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(ErrorPageTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(ErrorPageController);
    });
  });
});
