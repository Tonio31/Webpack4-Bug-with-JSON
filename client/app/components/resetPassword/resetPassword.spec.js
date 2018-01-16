/* eslint-disable camelcase */

import ResetPasswordModule from './resetPassword';
import ResetPasswordController from './resetPassword.controller';
import ResetPasswordComponent from './resetPassword.component';
import ResetPasswordTemplate from './resetPassword.html';

import LoginRoot from 'components/loginRoot/loginRoot';

describe('ResetPassword', () => {
  let $rootScope, $componentController, $location, $state;
  let STATES, SPINNERS, Data, SpinnerFactory;

  let token = 'ngjkahdgjkhfshdb';

  let spies = {
    spinnerFactory: {}
  };

  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(LoginRoot, ResetPasswordModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    STATES = $injector.get('STATES');
    SPINNERS = $injector.get('SPINNERS');
    SpinnerFactory = $injector.get('SpinnerFactory');
    Data = $injector.get('Data');
    $state = $injector.get('$state');
    $location = $injector.get('$location');
  }));

  describe('Module', () => {
    it(`About component should be visible when navigates to /reset_password?token=ngjkahdgjkhfshdb`, () => {
      $location.url(`${STATES.RESET_PASSWORD}?token=${token}`);
      $rootScope.$digest();
      expect($state.current.component).to.eq('resetPassword');
    });
  });

  describe('Controller', () => {
    // controller specs
    let controller;

    let goSpy, form, setValidityPasswordSpy, setValiditPasswordConfirmationySpy;

    beforeEach(() => {
      controller = $componentController('resetPassword', {
        $scope: $rootScope.$new()
      });


      form = {
        password: {
          $setValidity: () => {}
        },
        passwordConfirmation: {
          $setValidity: () => {}
        },
      };

      goSpy = sinon.stub($state, 'go');

      setValidityPasswordSpy = sinon.spy(form.password, '$setValidity');
      setValiditPasswordConfirmationySpy = sinon.spy(form.passwordConfirmation, '$setValidity');

      spies.spinnerFactory.show = sinon.spy(SpinnerFactory, 'show');
    });

    it('onInit() - test reset password state', () => {
      $location.url(`${STATES.RESET_PASSWORD}?token=${token}`);
      $rootScope.$digest();
      controller.$onInit();
      expect($location.url()).to.equal(`${STATES.RESET_PASSWORD}?token=${token}`);
      expect(controller.token).to.equal(token);
      expect(controller.labelAction).to.equal('RESET_PASSWORD');
    });

    it('onInit() - test creation password state', () => {
      $location.url(`${STATES.CREATION_PASSWORD}?token=${token}`);
      $rootScope.$digest();
      controller.$onInit();
      expect($location.url()).to.equal(`${STATES.CREATION_PASSWORD}?token=${token}`);
      expect(controller.labelAction).to.equal('CREATE_PASSWORD');
    });

    it('comparePassword set the field in the form to invalid if the password match', sinon.test( () => {
      controller.password = 'abc';
      controller.passwordConfirmation = 'abc';
      controller.comparePassword(form);

      sinon.assert.calledWith(setValidityPasswordSpy, 'nomatch', true);
      sinon.assert.calledWith(setValiditPasswordConfirmationySpy, 'nomatch', true);
    }));

    it('comparePassword set the field in the form to invalid if the password DONT match', sinon.test( () => {
      controller.password = 'abcdef';
      controller.passwordConfirmation = 'abc';
      controller.comparePassword(form);

      sinon.assert.calledWith(setValidityPasswordSpy, 'nomatch', false);
      sinon.assert.calledWith(setValiditPasswordConfirmationySpy, 'nomatch', false);
    }));


    it('sends an reset Password request when user click on resetPassword button', sinon.test((done) => {

      let authDataBackFromServer = {
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2p3dC1pZHAuZXhhbXBsZS5jb20iLCJzdWIiOiI0IiwibmJmIjoxNDg4NTQzOTQwLCJleHAiOjE3NTY0MjU1OTksImlhdCI6MTQ4ODU0Mzk0MCwianRpIjoiaWQxMjM0NTYifQ.N7xkSMlHPhfwxaG5Ibs-WUBJIc7aMAmq82sLG6fKfRE',
        user: {
          id: 4,
          first_name: 'tonio',
          last_name: 'mandela',
          email: 'tonio.mandela@usertest.com',
          username: 'tonio1234',
          gender: 'M',
          company: 'Barclays',
          division: 'Sales',
          cohort: 'BAC001',
          remember_token: null,
          created_at: '2017-02-28 15:17:11',
          updated_at: '2017-02-28 15:17:11',
          deleted_at: null
        }
      };

      let changePasswordPOSTRequest = {
        $save: (callback) => {
          return callback(authDataBackFromServer);
        }
      };

      sinon.stub(Data, 'changePassword', () => {
        return changePasswordPOSTRequest;
      });

      let formReset = {
        $valid: true
      };

      controller.token = token;
      controller.password = 'abc';
      controller.changePassword(formReset);

      expect(changePasswordPOSTRequest.token).to.equal(controller.token);
      expect(changePasswordPOSTRequest.password).to.equal(controller.password);
      sinon.assert.calledWith(goSpy, STATES.HOME);
      sinon.assert.calledWith(spies.spinnerFactory.show, SPINNERS.TOP_LEVEL);

      done();
    }));

    it('should redirect to the retrive credentials page when change password failed', sinon.test((done) => {

      let changePasswordPOSTRequestFail = {
        $save: (callback, errorCallback) => {
          return errorCallback({
            status: 404,
            statusText: 'token_not_found'
          });
        }
      };

      sinon.stub(Data, 'changePassword', () => {
        return changePasswordPOSTRequestFail;
      });

      let formReset = {
        $valid: true
      };

      controller.token = token;
      controller.password = 'abc';
      controller.changePassword(formReset);

      sinon.assert.calledWith(goSpy, STATES.RETRIEVE_CREDENTIALS);

      done();
    }));

  });


  describe('Component', () => {
    // component/directive specs
    let component = ResetPasswordComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(ResetPasswordTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(ResetPasswordController);
    });
  });
});
