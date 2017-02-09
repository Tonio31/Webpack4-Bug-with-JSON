import NavbarModule from './navbar'

describe('Navbar', () => {
  let $rootScope, $state, $location, $componentController, $compile, _;

  beforeEach(window.module(NavbarModule),
    window.module(global));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $state = $injector.get('$state');
    $location = $injector.get('$location');
    $compile = $injector.get('$compile');
    _ = $injector.get('_');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    beforeEach(() => {
      controller = $componentController('navbar', {
        $scope: $rootScope.$new()
      });
    });

    it('has a companyName property', () => { // erase if removing this.name from the controller
      expect(controller).to.have.property('companyName');
    });
  });

  describe('View', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<navbar></navbar>')(scope);
      scope.$apply();
    });

    it('has name in template', () => {
      expect(template.find('h1').find('a').html()).to.eq('Potentialife');
    });

  });
});
