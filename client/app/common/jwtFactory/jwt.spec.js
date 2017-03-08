/* eslint-disable camelcase */

import JwtModule from './jwt';

describe('JSON Web Token', () => {
  let JwtFactory, AuthInterceptorFactory, TOKEN, USER_ID, STATES;
  let $state;

  let authDetails = require('app/mockBackEndResponse/authenticateResponse.json');

  let mockLocalStorage;

  beforeEach(window.module(JwtModule, ($provide) => {
    mockLocalStorage = {};
    $provide.value('$localStorage', mockLocalStorage );
  }));

  beforeEach(inject(($injector) => {
    $state = $injector.get('$state');
    USER_ID = $injector.get('USER_ID');
    TOKEN = $injector.get('TOKEN');
    STATES = $injector.get('STATES');

    JwtFactory = $injector.get('JwtFactory');
    AuthInterceptorFactory = $injector.get('AuthInterceptor');
  }));

  describe('AuthInterceptorFactory', () => {

    let saveTokenSpy, saveUserIdSpy, goSpy;

    beforeEach(() => {
      sinon.stub(JwtFactory, 'getToken', () => { return authDetails.token; });
      sinon.stub(JwtFactory, 'getUserid', () => { return authDetails.user_id; });

      saveTokenSpy = sinon.spy(JwtFactory, 'saveToken');
      saveUserIdSpy = sinon.spy(JwtFactory, 'saveUserid');
      goSpy = sinon.stub($state, 'go');
    });

    it('request interceptor adds token ID and UserID (if they are valid) to every request', sinon.test( () => {

      let config = {
        headers: {}
      };

      let configModified = AuthInterceptorFactory.request(config);

      expect(configModified.headers.Authorization).to.eq(`Bearer ${authDetails.token}`);
      expect(configModified.headers.user_id).to.eq(authDetails.user_id);
    }));

    it('response interceptor (no error) save the token if the server sends it back', sinon.test( () => {

      let response = {
        data: {
          token: 'A new Token',
          user_id: 'User ID'
        }
      };

      AuthInterceptorFactory.response(response);
      sinon.assert.calledWith(saveTokenSpy, response.data.token);
      sinon.assert.calledWith(saveUserIdSpy, response.data.user_id);
    }));

    it('response interceptor (no error) dont save the token if the server dont send it back', sinon.test( () => {

      let response = {
        data: {}
      };

      AuthInterceptorFactory.response(response);
      sinon.assert.callCount(saveTokenSpy, 0);
      sinon.assert.callCount(saveUserIdSpy, 0);
    }));


    it('responseError interceptor redirect to login page if the error is 401 ', sinon.test( () => {

      let responseError = {
        status: 401
      };

      $state.$current.name = '/step-1';
      AuthInterceptorFactory.responseError(responseError);

      sinon.assert.calledWith(goSpy, STATES.LOGIN, { stateToRedirect: $state.$current.name } );
    }));

  });


  describe('JwtFactory', () => {

    it('save a Token in local Storage', () => {
      let token = 'token to save';
      JwtFactory.saveToken(token);
      expect(mockLocalStorage[TOKEN]).to.equal(token);
    });

    it('get a Token from local Storage', () => {
      mockLocalStorage[TOKEN] = 'token to retrieve';
      expect(JwtFactory.getToken()).to.equal(mockLocalStorage[TOKEN]);
    });

    it('save a UserID in local Storage', () => {
      let userId = 'userID to save';
      JwtFactory.saveUserid(userId);
      expect(mockLocalStorage[USER_ID]).to.equal(userId);
    });

    it('get a UserID from local Storage', () => {
      mockLocalStorage[USER_ID] = 'userId to retrieve';
      expect(JwtFactory.getUserid()).to.equal(mockLocalStorage[USER_ID]);
    });


    it('parse Json Web Token and return human readable object', () => {
      let jwtParsed = JwtFactory.parseJwt(authDetails.token);
      expect(jwtParsed).to.deep.equal({
        iss: 'https://jwt-idp.example.com',
        sub: '4',
        nbf: 1488543940,
        exp: 1756425599,
        iat: 1488543940,
        jti: 'id123456'
      });
    });


    it('isAuthedExpired() - Simulate authentication expired', () => {

      // Expiry date for this Token = 28 Feb 2017, this is older than now, so function should return true
      // eslint-disable-next-line max-len
      mockLocalStorage[TOKEN] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjQsImlzcyI6Imh0dHA6XC9cL2FwaXBsLmNpcHJpYW5zcGlyaWRvbi5jb21cL2F1dGhlbnRpY2F0ZSIsImlhdCI6MTQ4ODMwMTY3NSwiZXhwIjoxNDg4MzA1Mjc1LCJuYmYiOjE0ODgzMDE2NzUsImp0aSI6Ijk0Y2ExOGY5N2ZiNzUwMDBkMzNjOGY2ODA0YzgyNDI3In0.HP0cdDLtrCNd0uiELAwPpzzweRp_XbcfZfnJtojemRM';

      let isExpired = JwtFactory.isAuthedExpired();
      expect(isExpired).to.equal(true);
    });


    it('isAuthedExpired() - Simulate authentication NOT expired', () => {

      // Expiry date for this Token = 28 August 2025, (this test will fail after the 28 August 2025, you will have to update the token
      mockLocalStorage[TOKEN] = authDetails.token;

      let isExpired = JwtFactory.isAuthedExpired();
      expect(isExpired).to.equal(false);
    });

    it('logout removes USER_ID and TOKEN form localStorage', () => {
      mockLocalStorage[TOKEN] = 'token';
      mockLocalStorage[USER_ID] = 'userid';
      // Expiry date for this Token = 28 August 2025, (this test will fail after the 28 August 2025, you will have to update the token

      JwtFactory.logout();
      expect(mockLocalStorage[TOKEN]).to.equal(undefined);
      expect(mockLocalStorage[USER_ID]).to.equal(undefined);
    });
  });

});