/* eslint-disable camelcase */

import ResetPasswordModule from './resetPassword';
import ResetPasswordController from './resetPassword.controller';
import ResetPasswordComponent from './resetPassword.component';
import ResetPasswordTemplate from './resetPassword.html';

import LoginRoot from 'components/loginRoot/loginRoot';

describe('ResetPassword', () => {
  let $rootScope, $componentController, $location, $state;
  let STATES, Data;

  let token = 'ngjkahdgjkhfshdb';
  let userId = '12';

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
    Data = $injector.get('Data');
    $state = $injector.get('$state');
    $location = $injector.get('$location');
  }));

  describe('Module', () => {
    it(`About component should be visible when navigates to /reset_password?token=ngjkahdgjkhfshdb&user_id=12`, () => {
      $location.url(`${STATES.RESET_PASSWORD}?token=${token}&user_id=${userId}`);
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
    });

    it('remove the url Parameters from the URL', () => { // erase if removing this.name from the controller
      $location.url(`${STATES.RESET_PASSWORD}?token=${token}&user_id=${userId}`);
      $rootScope.$digest();
      controller.$onInit();
      expect($location.url()).to.equal(STATES.RESET_PASSWORD);
      expect(controller.token).to.equal(token);
      expect(controller.userId).to.equal(userId);
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


    it('sends an reset Password request when user click on resetPassword button', sinon.test( (done) => {

      let resetPasswordPOSTRequest = {
        $save: (callback) => {
          return callback();
        }
      };

      sinon.stub(Data, 'resetPassword', () => {
        return resetPasswordPOSTRequest;
      });

      let formReset = {
        $valid: true
      };

      controller.token = token;
      controller.userId = userId;
      controller.password = 'abc';
      controller.resetPassword(formReset);

      expect(resetPasswordPOSTRequest.token).to.equal(controller.token);
      expect(resetPasswordPOSTRequest.user_id).to.equal(controller.userId);
      expect(resetPasswordPOSTRequest.password).to.equal(controller.password);
      sinon.assert.calledWith(goSpy, STATES.HOME);

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
