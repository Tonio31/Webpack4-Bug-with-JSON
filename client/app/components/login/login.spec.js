import LoginModule from './login';
import LoginController from './login.controller';
import LoginComponent from './login.component';
import LoginTemplate from './login.html';

describe('Login', () => {
  let $rootScope, $state, $componentController, $compile, $window, $q;

  let Data, STATES;
  let goFn;

  let formLogin = {
    $valid: true
  };

  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(LoginModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $state = $injector.get('$state');
    $q = $injector.get('$q');
    $compile = $injector.get('$compile');
    $window = $injector.get('$window');
    Data = $injector.get('Data');
    STATES = $injector.get('STATES');

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

    it('change state when we click on Forgot Login Details', () => {
      controller.forgotCredentials();

      sinon.assert.calledWith(goFn, STATES.RETRIEVE_CREDENTIALS);
    });


    it('sends an authentication request when user click on login button', () => {

      let authDataBackFromServer = require('app/mockBackEndResponse/authenticateResponse.json');

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

    it('sends an authentication request but dont change state if it fails', () => {

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
    });

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
