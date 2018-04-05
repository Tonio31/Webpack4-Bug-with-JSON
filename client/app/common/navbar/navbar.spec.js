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
    },

    getFullName: () => {
      return 'Tonio Mandela';
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
      expect(controller.isBannerExist()).to.not.eq(0);
    });

    it('has a Potentialife property', () => {
      expect(controller).to.have.property('Potentialife');
    });

    it('getUserFullName() - returns user full name', () => {
      expect(controller.getUserFullName()).to.eq(mockUser.getFullName());
    });

  });

  describe('View <navbar display-menu="true"></navbar>', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.displayMenu = true;
      template = $compile('<navbar display-menu="displayMenu"></navbar>')(scope);
      scope.$apply();
    });

    it('has name in template', () => {
      expect(template.find('h1').find('a').html()).to.eq('Potentialife');
    });


    it('<aside>(left menu) and hamburger icon menu are displayed', () => {
      expect(template.find('aside').html()).to.not.be.an('undefined');
      let hambergerIcon = angular.element(template[0].querySelectorAll('.menu-toggle-button'));
      expect(hambergerIcon.html()).to.not.be.an('undefined');
    });

  });


  describe('View <navbar display-menu="false"></navbar>', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.displayMenu = false;
      template = $compile('<navbar display-menu="displayMenu"></navbar>')(scope);
      scope.$apply();
    });

    it('<aside>(left menu) and hamburger icon menu are NOT displayed', () => {
      expect(template.find('aside').html()).to.be.an('undefined');
      let hambergerIcon = angular.element(template[0].querySelectorAll('.menu-toggle-button'));
      expect(hambergerIcon.html()).to.be.an('undefined');
    });

  });
});
