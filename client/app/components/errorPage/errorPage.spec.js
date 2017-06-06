import ErrorPageModule from './errorPage';
import ErrorPageController from './errorPage.controller';
import ErrorPageComponent from './errorPage.component';
import ErrorPageTemplate from './errorPage.html';

describe('ErrorPage', () => {
  let $rootScope, $componentController, $compile, $stateParams;

  let mockTranslateFilter = (value) => {
    return value;
  };

  let ZendeskWidget;
  beforeEach(window.module(ErrorPageModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
    $provide.value('ZendeskWidget', ZendeskWidget);
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
    $stateParams = $injector.get('$stateParams');
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

    it('$onInit() - display specific error message if it is in the $stateParams', () => {
      $stateParams.errorMsg = 'ERROR_402';
      controller.$onInit();
      expect(controller.errorMsg).to.eq('ERROR_402');
    });

    it('$onInit() - display generic error message ERROR_UNEXPECTED if $stateParams is empty', () => {
      $stateParams.errorMsg = null;
      controller.$onInit();
      expect(controller.errorMsg).to.eq('ERROR_UNEXPECTED');
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


    it('the h1 tag has the good content (ERROR_UNEXPECTED)', () => {
      expect(template.find('h1').html()).to.eq('ERROR_UNEXPECTED');
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
