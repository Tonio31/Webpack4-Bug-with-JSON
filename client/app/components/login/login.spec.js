import LoginModule from './login';
import LoginController from './login.controller';
import LoginComponent from './login.component';
import LoginTemplate from './login.html';

describe('Login', () => {
  let $rootScope, $state, $componentController, $compile;

  let Data, STATES;
  let goFn;

  beforeEach(window.module(LoginModule));

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
    let stateParams = {
      stateToRedirect: '/step-1'
    };
    beforeEach(() => {
      controller = $componentController('login', {
        $scope: $rootScope.$new(),
        $stateParams: stateParams
      });
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

      controller.login();

      expect(authPOSTRequestResource.email).to.equal(controller.email);
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

      controller.login();

      expect(authPOSTRequestResourceFail.email).to.equal(controller.email);
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
      expect(template.find('h1').html()).to.eq('Potentialife');
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
