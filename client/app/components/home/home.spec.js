import HomeModule from './home'


describe('Home', () => {
  let $rootScope, $httpBackend, $state, $location, $componentController, $compile;
  let UserInfo, Menu, Data;

  let contentBindings = require('app/mockBackEndResponse/homeContent.json');

  let currentProgressionObject = 'current Progression Object';
  let menuObject = {
    data: require('app/mockBackEndResponse/menu-1.json').menudata[0]
  };
  let firstName = 'Tonio';

  beforeEach(window.module(HomeModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $httpBackend = $injector.get('$httpBackend');
    $state = $injector.get('$state');
    $location = $injector.get('$location');
    $compile = $injector.get('$compile');
    Data = $injector.get('Data');
    UserInfo = $injector.get('UserInfo');
    Menu = $injector.get('Menu');

    sinon.stub(Menu, 'getCurrentProgression', () => currentProgressionObject);
    sinon.stub(Menu, 'getMenu', () => menuObject);
    sinon.stub(UserInfo, 'getFirstName', () => firstName);
    sinon.stub(Data, 'getHomeContent', () => contentBindings);
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

    let bindings = {
      content: contentBindings
    };

    beforeEach(() => {

      controller = $componentController('home', {
        $scope: $rootScope.$new()
      }, bindings);

      controller.$onInit();
    });

    it('has the current progression from Menu Factory', () => {
      expect(controller.currentProgression).to.equal(currentProgressionObject);
    });

    it('has the menu from Menu Factory', () => {
      expect(controller.menu).to.equal(menuObject);
    });


    it('has a name from UserInfo factory', () => {
      expect(controller.firstName).to.equal(firstName);
    });

    it('has a quote property', () => {
      expect(controller.quote).to.contain('Now I understand my strenghts');
    });
  });

  describe('View', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.content = contentBindings;
      template = $compile('<home content="content"></home>')(scope);
      scope.$apply();
    });

    it('has a Welcome title', () => {
      expect(template.find('h1').html()).to.eq('WELCOME Tonio!');
    });

    it('has a 3 cycles', () => {
      let cycles = angular.element(template[0].querySelectorAll('.cycle'));
      expect(cycles.length).to.eq(3);
      expect(cycles[0].textContent).to.contain('CYCLE 1');
      expect(cycles[1].textContent).to.contain('CYCLE 2');
      expect(cycles[2].textContent).to.contain('CYCLE 3');

      let cycle1 = angular.element(template[0].querySelector('.cycle'));
      expect(cycle1.html()).to.contain('<h4 class="ng-binding">CYCLE 1</h4>');
    });

    it('has a PARTICIPANT_REFLECTION section', () => {
      let quote = angular.element(template[0].querySelector('#quote'));
      let quoteTitle = quote.find('h4');
      expect(quoteTitle.html()).to.eq('PARTICIPANT_REFLECTION');
    });

    it('has a faq section', () => {
      let faq = angular.element(template[0].querySelector('#faq'));
      let faqTitle = faq.children();
      expect(faqTitle.html()).to.eq('FAQS');
    });

    it('has a support section', () => {
      let support = angular.element(template[0].querySelector('#support'));
      let supportTitle = support.children();
      expect(supportTitle.html()).to.eq('SUPPORT');
    });
  });
});
