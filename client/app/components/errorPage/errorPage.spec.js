import ErrorPageModule from './errorPage';
import ErrorPageController from './errorPage.controller';
import ErrorPageComponent from './errorPage.component';
import ErrorPageTemplate from './errorPage.html';

describe('ErrorPage', () => {
  let $rootScope, $componentController, $compile;

  let mockTranslateFilter = (value) => {
    return value;
  };

  let mockBugsnag = {
    notify: () => {},
    getStatesHistoryAsString: () => { return '/Home'; }
  };

  let ZendeskWidget;
  beforeEach(window.module(ErrorPageModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
    $provide.value('ZendeskWidget', ZendeskWidget);
    $provide.value('BugsnagUtils', mockBugsnag);
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
    let bindings = {
      data: {
        errorMsg: 'ERROR_402'
      }
    };

    beforeEach(() => {
      controller = $componentController('errorPage', {
        $scope: $rootScope.$new()
      }, bindings);
    });

    it('$onInit() - display specific error message if it is in the input', () => {
      controller.$onInit();
      expect(controller.errorMsg).to.eq('ERROR_402');
    });

    it('$onInit() - display generic error message ERROR_UNEXPECTED if input data is empty', () => {
      controller.data.errorMsg = null;
      controller.$onInit();
      expect(controller.errorMsg).to.eq('ERROR_UNEXPECTED');
    });
  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.data = {
        errorMsg: 'ERROR_402'
      };
      template = $compile('<error-page data="data"></error-page>')(scope);
      scope.$apply();
    });


    it('the h1 tag has the good content (ERROR_402)', () => {
      expect(template.find('h1').html()).to.eq('ERROR_402');
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
