import CompanyBannerModule from './companyBanner';
import CompanyBannerController from './companyBanner.controller';
import CompanyBannerComponent from './companyBanner.component';
import CompanyBannerTemplate from './companyBanner.html';

describe('CompanyBanner', () => {
  let $rootScope, $componentController, $compile;


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

  beforeEach(window.module(CompanyBannerModule, ($provide) => {
    $provide.value('User', mockUser );
  }));


  beforeEach(window.module(CompanyBannerModule));

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
      controller = $componentController('companyBanner', {
        $scope: $rootScope.$new()
      });
    });


    it('isBannerExist() return a truthy expression is some data exists', () => {
      expect(controller.isBannerExist()).to.not.eq(0 );
    });

    it('controller.data is initialised from User object', () => {
      expect(controller.data).to.deep.eq(mockUser.getCompanyBanner());
    });

    it('getCssStyle() returns the good style object', () => {

      let expectedStyle = {
        'background-color': mockUser.getCompanyBanner().bgColor,
        'color': mockUser.getCompanyBanner().textColor
      };

      expect(controller.getCssStyle()).to.deep.eq(expectedStyle);
    });
  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<company-banner></company-banner>')(scope);
      scope.$apply();
    });

    it('Header is defined', () => {
      expect(template.find('p').html()).to.eq(mockUser.getCompanyBanner().header);
    });

    it('Sub Header is defined', () => {
      expect(template.find('p').next().html()).to.eq(mockUser.getCompanyBanner().subHeader);
    });

    it('Company Logo img tag has the good src', () => {
      expect(template.find('img').attr('src')).to.eq(mockUser.getCompanyBanner().logo);
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = CompanyBannerComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(CompanyBannerTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(CompanyBannerController);
    });
  });
});
