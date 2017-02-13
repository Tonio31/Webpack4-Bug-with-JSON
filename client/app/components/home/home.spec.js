import HomeModule from './home'


describe('Home', () => {
  let $rootScope, $state, $location, $componentController, $compile, Data;

  beforeEach(window.module(HomeModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $state = $injector.get('$state');
    $location = $injector.get('$location');
    $compile = $injector.get('$compile');
    Data = $injector.get('Data');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
    it('default component should be home', () => {
      $location.url('/');
      $rootScope.$digest();
      expect($state.current.component).to.eq('home');
    });
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    beforeEach(() => {
      controller = $componentController('home', {
        $scope: $rootScope.$new()
      });
    });

    it('DOES A TEST', () => {
      expect(controller.getName()).to.equal('Tonio');
    });

    it('has a name from LogDecoratorFactory factory', () => { // erase if removing this.name from the controller
      sinon.stub(Data, 'getUser', () => ({ name: "Stub is Working" }));
      expect(controller.getName()).to.equal('Stub is Working');
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
      template = $compile('<home></home>')(scope);
      scope.$apply();
    });

    it('has name in template', () => {
      expect(template.find('h1').html()).to.eq('Potentialife');
    });

  });
});
