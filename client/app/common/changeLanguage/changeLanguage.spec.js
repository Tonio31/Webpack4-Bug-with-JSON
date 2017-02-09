import ChangeLanguageModule from './changeLanguage'

describe('ChangeLanguage', () => {
  let $rootScope, $state, $location, $componentController, $compile;

  beforeEach(window.module(ChangeLanguageModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $state = $injector.get('$state');
    $location = $injector.get('$location');
    $compile = $injector.get('$compile');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    beforeEach(() => {
      controller = $componentController('changeLanguage', {
        $scope: $rootScope.$new()
      });
    });

    it('has a name property', () => { // erase if removing this.name from the controller
      expect(controller).to.have.property('name');
    });
  });

  describe('View', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<change-language></change-language>')(scope);
      scope.$apply();
    });

    it('has flag-icon in template', () => {
      expect(template.find('span').attr('class').split(" ")).to.deep.equal(["flag-icon", "flag-icon-fr"]);
    });

  });
});
