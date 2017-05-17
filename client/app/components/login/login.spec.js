import LoginModule from './login';
import LoginController from './login.controller';
import LoginComponent from './login.component';
import LoginTemplate from './login.html';

describe('Login', () => {
  let $rootScope, $state, $componentController, $compile, $window, $q;

  let SpinnerFactory, Data, STATES, SPINNERS, WEBSITE_CONFIG;
  let goFn;

  let spies = {
    spinnerFactory: {}
  };

  let formLogin = {
    $valid: true
  };

  let mockTranslateFilter = (value) => {
    return value;
  };

  let mockUtility = {
    getUserTargetWebsite: () => {
      return $q.resolve('my');
    }
  };

  beforeEach(window.module(LoginModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
    $provide.value('Utility', mockUtility );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $state = $injector.get('$state');
    $q = $injector.get('$q');
    $compile = $injector.get('$compile');
    $window = $injector.get('$window');
    Data = $injector.get('Data');
    SpinnerFactory = $injector.get('SpinnerFactory');
    STATES = $injector.get('STATES');
    SPINNERS = $injector.get('SPINNERS');
    WEBSITE_CONFIG = $injector.get('WEBSITE_CONFIG');

    goFn = sinon.stub($state, 'go');

    $window.ga = () => {};
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    let stateParams = {
      stateToRedirect: '/step-1'
    };
    beforeEach(() => {
      controller = $componentController('login', {
        $scope: $rootScope.$new(),
        $stateParams: stateParams
      });
    });

    it('setInvalidLoginMessage() - change state when we click on Forgot Login Details', sinon.test( () => {

      spies.spinnerFactory.hide = sinon.spy(SpinnerFactory, 'hide');

      controller.setInvalidLoginMessage();
      expect(controller.invalidLogin).to.eq(true);
      sinon.assert.calledWith(spies.spinnerFactory.hide, SPINNERS.TOP_LEVEL);
    }));

    it('forgotCredentials() - change state when we click on Forgot Login Details', () => {
      controller.forgotCredentials();

      sinon.assert.calledWith(goFn, STATES.RETRIEVE_CREDENTIALS);
    });


    it('sends an authentication request when user click on login button', () => {

      let authDataBackFromServer = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2p3dC1pZHAuZXhhbXBsZS5jb20iLCJzdWIiOiI0IiwibmJmIjoxNDg4NTQzOTQwLCJleHAiOjE3NTY0MjU1OTksImlhdCI6MTQ4ODU0Mzk0MCwianRpIjoiaWQxMjM0NTYifQ.N7xkSMlHPhfwxaG5Ibs-WUBJIc7aMAmq82sLG6fKfRE',
        user: {
          id: 4,
          first_name: 'tonio',
          last_name: 'mandela',
          email: 'tonio.mandela@usertest.com'
        }
      };

      let authPOSTRequestResource = {
        $save: (callback) => {
          return callback(authDataBackFromServer);
        }
      };

      sinon.stub(Data, 'getUserAuthData', () => {
        return authPOSTRequestResource;
      });

      sinon.stub(Data, 'getParticipantDetails', () => {
        let deferred = $q.defer();

        deferred.resolve();
        return deferred.promise;
      });

      controller.login(formLogin);

      $rootScope.$digest();
      expect(authPOSTRequestResource.email).to.equal(controller.username);
      expect(authPOSTRequestResource.password).to.equal(controller.password);

      sinon.assert.calledWith(goFn, STATES.HOME, { forceRedirect: stateParams.stateToRedirect });
    });

    it('loginOnOtherPlWebsite() - auth request fail on program but succeed on my', sinon.test(() => {

      let authPOSTRequestResourceFail = {
        $save: (callback, callbackError) => {
          return callbackError();
        }
      };

      sinon.stub(Data, 'getUserAuthData', () => {
        return authPOSTRequestResourceFail;
      });

      controller.login(formLogin);

      expect(authPOSTRequestResourceFail.email).to.equal(controller.username);
      expect(authPOSTRequestResourceFail.password).to.equal(controller.password);

      sinon.assert.callCount(goFn, 0);



      let authOK = {
        user: '1'
      };

      let checkAuthPOSTReplyOk = {
        $check: (callback) => {
          return callback(authOK);
        }
      };

      let checkAuthOnOtherPlWebsiteSpy = sinon.stub(Data, 'checkAuthOnOtherPlWebsite');
      checkAuthOnOtherPlWebsiteSpy.onFirstCall().returns(checkAuthPOSTReplyOk);

      $rootScope.$digest();

      expect(controller.triggerSubmitFrom).to.eq(true);
      expect(controller.externalWebsite).to.eq(WEBSITE_CONFIG.OTHER_PL_SITES_API.my.loginUrl);
    }));

  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<login></login>')(scope);
      scope.$apply();
    });


    it('has a h1 title', () => {
      expect(template.find('h2').html()).to.eq('LOGIN');
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = LoginComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(LoginTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(LoginController);
    });
  });
});
