import NavbarModule from '../navbar';

describe('Navbar menuButton', () => {
  let $rootScope, $componentController, $compile, $state;
  let Data, JwtFactory, ZendeskWidget, STATES, ICON_FONTELLO;

  let mockTranslateFilter = (value) => {
    return value;
  };

  let mockUser = {
    getCompanyBanner: () => {
      return {
        bgColor: 'orange',
        header: 'Inspiring Leadership',
        logo: 'https://logos.keycdn.com/keycdn-logo.png',
        subHeader: 'BE YOUR BEST, BE THE DIFFERENCE',
        textColor: 'white'
      };
    }
  };

  let spies = {
    Data: {},
    JwtFactory: {},
    ZendeskWidget: {},
    $state: {}
  };

  beforeEach(window.module(NavbarModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
    $provide.value('User', mockUser );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    Data = $injector.get('Data');
    JwtFactory = $injector.get('JwtFactory');
    $state = $injector.get('$state');
    ZendeskWidget = $injector.get('ZendeskWidget');
    STATES = $injector.get('STATES');
    ICON_FONTELLO = $injector.get('ICON_FONTELLO');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;

    beforeEach(() => {
      controller = $componentController('navbarMenuButton', {
        $scope: $rootScope.$new()
      });
    });

    it('$onInit() - init titles based on input data', () => {
      controller.data = {
        type: 'STEP',
        status: 'current',
        title: 'Step 1',
        stepNumber: 1,
        name: 'Best step in the world'
      };

      controller.$onInit();

      expect(controller.type).to.eq(controller.data.type);
      expect(controller.status).to.eq(controller.data.status);
      expect(controller.topTitle).to.eq(controller.data.title);
      expect(controller.bottomTitle).to.eq(`${controller.data.stepNumber}. ${controller.data.name}`);
    });
    it('$onChanges() update the status of the button if it changes', () => {
      controller.category = 'back-button';
      controller.status = 'current';
      controller.data = {
        status: 'completed'
      };

      controller.$onChanges();
      expect(controller.status).not.to.eq(controller.data.status);

      controller.category = 'LEVEL';
      controller.$onChanges();
      expect(controller.status).to.eq(controller.data.status);

    });

    it('isStepActive() returns true if the step is the one the user selected', () => {
      controller.data = {
        fullUrl: '/test-url/'
      };
      $state.current.name = '/test-url/';
      expect(controller.isStepActive()).to.eq(true);
    });

    it('isStepActive() returns false if its the back button', () => {
      controller.category = 'back-button';
      expect(controller.isStepActive()).to.eq(false);
    });

    it('isVideoStep() returns true if the step is a video step', () => {
      controller.data = {
        category: 'Video'
      };
      expect(controller.isVideoStep()).to.eq(true);
    });

    it('getIconValue() - returns "" if not active & not video', () => {
      sinon.stub(controller, 'isStepActive', () => {
        return false;
      });
      sinon.stub(controller, 'isVideoStep', () => {
        return false;
      });

      expect(controller.getIconValue()).to.eq('');
    });

    it('getIconValue() - returns arrow right for the active step', () => {
      sinon.stub(controller, 'isStepActive', () => {
        return true;
      });

      expect(controller.getIconValue()).to.eq(ICON_FONTELLO.ARROW_RIGHT);
    });

    it('getIconValue() - returns video if the step is not active and category=video', () => {
      sinon.stub(controller, 'isStepActive', () => {
        return false;
      });

      sinon.stub(controller, 'isVideoStep', () => {
        return true;
      });

      expect(controller.getIconValue()).to.eq(ICON_FONTELLO.VIDEO);
    });

    it('menuButtonClick() - call logout if the button is "Logout"', () => {
      controller.status = 'logout';

      let logoutSpy = sinon.stub(controller, 'logout');
      controller.menuButtonClick();
      sinon.assert.calledWith(logoutSpy);
    });

    it('logout() calls JWT factory, send a post request to server, hide zendesk and redirect to login page', sinon.test(() => {

      spies.Data.logout = sinon.spy(Data, 'logout');
      spies.JwtFactory.logout = sinon.spy(JwtFactory, 'logout');
      spies.ZendeskWidget.hide = sinon.stub(ZendeskWidget, 'hide');
      spies.$state.go = sinon.stub($state, 'go');

      controller.logout();

      sinon.assert.calledWith(spies.Data.logout);
      sinon.assert.calledWith(spies.JwtFactory.logout);
      sinon.assert.calledWith(spies.ZendeskWidget.hide);
      sinon.assert.calledWith(spies.$state.go, STATES.LOGIN);
    }));
  });

  describe('View <navbar-menu-button data="dataButton"></navbar-menu-button>', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.data = {
        id: 5,
        title: 'Step 5',
        name: 'Video: Managing your weaknesses',
        category: 'video',
        description: 'Approx. 3 mins',
        slug: 'step-5',
        order: 4,
        status: 'locked',
        fullUrl: '/potentialife-course/cycle-1/module-1/step-5',
        type: 'STEP',
        stepNumber: 5
      };

      template = $compile('<navbar-menu-button data="data"></navbar-menu-button>')(scope);
      scope.$apply();
    });

    it('top title is inserted', () => {
      let topTitleElement = angular.element(template[0].querySelectorAll('.top-title'));
      expect(topTitleElement.html()).to.eq('Step 5');
    });

    it('Bottom title is inserted', () => {
      let bottomTitleElement = angular.element(template[0].querySelectorAll('.bottom-title'));
      expect(bottomTitleElement.html()).to.eq('5. Video: Managing your weaknesses');
    });

    it('Fontello Icon on the right is video Icon', () => {
      let fontelloIcon = angular.element(template[0].querySelectorAll('.fontello-icon-right span'));
      expect(fontelloIcon.html()).to.eq('v');
    });
  });

  describe('View <navbar-menu-button data="dataButton" category="back-button"></navbar-menu-button>', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.data = {
        id: 5,
        title: 'Module 1',
        name: 'Encounter Strengths',
        description: 'Approx. 30 mins',
        slug: 'module-1',
        order: 1,
        status: 'current',
        children: [],
        fullUrl: '/potentialife-course/cycle-1/module-1',
        type: 'MODULE'
      };
      template = $compile('<navbar-menu-button data="data" category="\'back-button\'"></navbar-menu-button>')(scope);
      scope.$apply();
    });

    it('no Fontello Icon on the right for back-button', () => {
      let fontelloIcon = angular.element(template[0].querySelectorAll('.fontello-icon-right span'));
      expect(fontelloIcon.html()).to.eq(undefined);
    });

    it('has a "back" class', () => {
      let backClass = angular.element(template[0].querySelectorAll('.back'));
      expect(backClass.length).to.eq(1);
    });
  });

});
