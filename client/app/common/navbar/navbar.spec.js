import NavbarModule from './navbar';

describe('Navbar', () => {
  let $rootScope, $componentController, $compile;

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

  beforeEach(window.module(NavbarModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
    $provide.value('User', mockUser );
  }));

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
      controller = $componentController('navbar', {
        $scope: $rootScope.$new()
      });
    });

    it('isBannerExist() return a truthy expression is some data exists', () => {
      expect(controller.isBannerExist()).to.not.eq(0 );
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
