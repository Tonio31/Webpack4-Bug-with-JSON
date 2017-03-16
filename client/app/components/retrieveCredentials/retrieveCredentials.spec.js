import RetrieveCredentialsModule from './retrieveCredentials';
import RetrieveCredentialsController from './retrieveCredentials.controller';
import RetrieveCredentialsComponent from './retrieveCredentials.component';
import RetrieveCredentialsTemplate from './retrieveCredentials.html';

describe('RetrieveCredentials', () => {
  let $rootScope, $state, $componentController, $compile;
  let Data, STATES;
  let goFn;

  let formSendEmail = {
    $valid: true
  };

  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(RetrieveCredentialsModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $state = $injector.get('$state');
    $compile = $injector.get('$compile');
    Data = $injector.get('Data');
    STATES = $injector.get('STATES');

    goFn = sinon.stub($state, 'go');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    beforeEach(() => {
      controller = $componentController('retrieveCredentials', {
        $scope: $rootScope.$new()
      });
    });


    it('change state when we click on Back To Login', () => {
      controller.backToLogin();

      sinon.assert.calledWith(goFn, STATES.LOGIN);
    });


    it('sends an forgot password request request when user click on resetPassword button', () => {

      let sendRecoverPasswordEmailPOST = {
        $save: (callback) => {
          return callback();
        }
      };

      sinon.stub(Data, 'sendRecoverPasswordEmail', () => {
        return sendRecoverPasswordEmailPOST;
      });

      controller.email = 'myEmail@gmail.com';
      controller.resetPassword(formSendEmail);

      expect(sendRecoverPasswordEmailPOST.email).to.equal(controller.email);
      expect(controller.emailSent).to.equal(true);
    });

  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<retrieve-credentials></retrieve-credentials>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h1').html()).to.eq('RESET_PASSWORD');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = RetrieveCredentialsComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(RetrieveCredentialsTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(RetrieveCredentialsController);
    });
  });
});
