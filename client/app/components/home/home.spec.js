import HomeModule from './home';
import Main from 'components/main/main';


describe('Home', () => {
  let $rootScope, $state, $location, $componentController, $compile;
  let Data, User, Menu;

  let contentBindings = {
    id: 20,
    name: 'Brandy Kilback',
    reflection: 'Nostrum culpa illo excepturi ipsa. Possimus quo natus est quam. Error ut natus non similique numquam et. Ut id inventore est.'
  };

  let currentProgressionObject = {
    data: {
      current_cycle: {
      },
      current_module: {
      },
      current_step: {
        status: 'completed',
        fullUrl: '/potentialife-course/cycle-1/module-1/step-9'
      }
    }
  };
  let menuObject = {
    data: require('app/mockBackEndResponse/51/menu.json').menudata[0]
  };
  let firstName = 'Tonio';

  let ZendeskWidget;


  beforeEach(window.module(Main, HomeModule, ($provide) => {
    $provide.value('ZendeskWidget', ZendeskWidget);
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $state = $injector.get('$state');
    $location = $injector.get('$location');
    $compile = $injector.get('$compile');
    User = $injector.get('User');
    Data = $injector.get('Data');
    Menu = $injector.get('Menu');

    sinon.stub(Menu, 'getCurrentProgression', () => { return currentProgressionObject; } );
    sinon.stub(Menu, 'getMenu', () => { return menuObject; } );
    sinon.stub(User, 'getFirstName', () => { return firstName; } );

    sinon.stub(Data, 'getDynamicContentPromise', () => { return contentBindings; } );
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


    it('has a name from User factory', () => {
      expect(controller.firstName).to.equal(firstName);
    });

    it('test getDonutTitle() function', () => {
      // Cycle1 is not locked
      let cycle1 = menuObject.data.children[0];

      expect(controller.getDonutTitle(cycle1)).to.eq('40%');

      // Cycle 2 is locked, see comment in home.controller.js to understand why we return 'l' when it's locked
      let cycle2 = menuObject.data.children[1];
      expect(controller.getDonutTitle(cycle2)).to.eq('l');
    });

  });

  describe('View', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.content = contentBindings;

      let offCanvasWrapCtrl = {
        hide: () => {}
      };

      let element = angular.element('<home content="content"></home>');
      element.data('$offCanvasWrapController', offCanvasWrapCtrl);

      template = $compile(element)(scope);
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
