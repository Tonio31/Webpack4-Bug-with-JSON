/* eslint-disable camelcase */

import JwtModule from './jwt';

describe('JSON Web Token', () => {
  let JwtFactory, AuthInterceptorFactory, TOKEN, USER_ID;
  let $state, $q, $location;

  let authDetails = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2p3dC1pZHAuZXhhbXBsZS5jb20iLCJzdWIiOiI0IiwibmJmIjoxNDg4NTQzOTQwLCJleHAiOjE3NTY0MjU1OTksImlhdCI6MTQ4ODU0Mzk0MCwianRpIjoiaWQxMjM0NTYifQ.N7xkSMlHPhfwxaG5Ibs-WUBJIc7aMAmq82sLG6fKfRE',
    user: {
      id: 129,
      email: 'tonio1@gmail.com',
      username: 'tonio1',
      first_name: 'Tonio',
      last_name: 'Mandela',
      gender: 'm',
      created_at: '2017-05-04 15:33:54',
      updated_at: '2017-05-04 15:33:54',
      deleted_at: null,
      pass: 'whatever',
      division: null,
      cohort: 'TSTCH001',
      company: 'Company 1',
      companyBanner: null
    }
  };

  let mockLocalStorage;

  beforeEach(window.module(JwtModule, ($provide) => {
    mockLocalStorage = {};
    $provide.value('$localStorage', mockLocalStorage );
  }));

  beforeEach(inject(($injector) => {
    $state = $injector.get('$state');
    $q = $injector.get('$q');
    USER_ID = $injector.get('USER_ID');
    TOKEN = $injector.get('TOKEN');

    JwtFactory = $injector.get('JwtFactory');
    AuthInterceptorFactory = $injector.get('AuthInterceptor');
    $location = $injector.get('$location');

    $location.search = () => {
      return {
        user_id: 4,
        token: 'token'
      };
    };

  }));

  describe('AuthInterceptorFactory', () => {

    let saveTokenSpy, saveUserIdSpy;

    beforeEach(() => {
      sinon.stub(JwtFactory, 'getToken', () => { return authDetails.token; });
      sinon.stub(JwtFactory, 'getUserId', () => { return authDetails.user_id; });

      saveTokenSpy = sinon.spy(JwtFactory, 'saveToken');
      saveUserIdSpy = sinon.spy(JwtFactory, 'saveUserId');
    });

    it('request interceptor adds token ID and UserID (if they are valid) to every request to the back end', sinon.test( () => {

      let config = {
        headers: {},
        url: BACK_END_API
      };

      let configModified = AuthInterceptorFactory.request(config);

      expect(configModified.headers.Authorization).to.eq(`Bearer ${authDetails.token}`);
      expect(configModified.headers.user_id).to.eq(authDetails.user_id);
    }));

    it('request interceptor doesnt add token ID and UserID to request to the outside world', sinon.test( () => {

      let config = {
        headers: {},
        url: 'http://somethingFarFarAway.com/Infinite'
      };

      let configModified = AuthInterceptorFactory.request(config);

      expect(configModified.headers.Authorization).to.eq(undefined);
      expect(configModified.headers.user_id).to.eq(undefined);
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
      sinon.assert.callCount(saveUserIdSpy, 0);
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
      let something = AuthInterceptorFactory.responseError(responseError);

      expect(something).to.deep.eq($q.reject(responseError));
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
      JwtFactory.saveUserId(userId);
      expect(mockLocalStorage[USER_ID]).to.equal(userId);
    });

    it('get a UserID from local Storage', () => {
      mockLocalStorage[USER_ID] = 'userId to retrieve';
      expect(JwtFactory.getUserId()).to.equal(mockLocalStorage[USER_ID]);
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


    it('isAuthExpired() - Simulate authentication expired', () => {

      // Expiry date for this Token = 28 Feb 2017, this is older than now, so function should return true
      // eslint-disable-next-line max-len
      mockLocalStorage[TOKEN] = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjQsImlzcyI6Imh0dHA6XC9cL2FwaXBsLmNpcHJpYW5zcGlyaWRvbi5jb21cL2F1dGhlbnRpY2F0ZSIsImlhdCI6MTQ4ODMwMTY3NSwiZXhwIjoxNDg4MzA1Mjc1LCJuYmYiOjE0ODgzMDE2NzUsImp0aSI6Ijk0Y2ExOGY5N2ZiNzUwMDBkMzNjOGY2ODA0YzgyNDI3In0.HP0cdDLtrCNd0uiELAwPpzzweRp_XbcfZfnJtojemRM';

      let isExpired = JwtFactory.isAuthExpired();
      expect(isExpired).to.equal(true);
    });


    it('isAuthExpired() - Simulate authentication NOT expired', () => {

      // Expiry date for this Token = 28 August 2025, (this test will fail after the 28 August 2025, you will have to update the token
      mockLocalStorage[TOKEN] = authDetails.token;

      let isExpired = JwtFactory.isAuthExpired();
      expect(isExpired).to.equal(false);
    });

    it('isAuthExpired() - Simulate parsing error', sinon.test( () => {

      mockLocalStorage[TOKEN] = 'something that will break on parsing';

      let isExpired = JwtFactory.isAuthExpired();
      expect(isExpired).to.equal(true);
      expect(mockLocalStorage[TOKEN]).to.equal(undefined);
      expect(mockLocalStorage[USER_ID]).to.equal(undefined);
    }));

    it('isLoginInfoAvailable() - returns true if isAuthExpired returns false', sinon.test( () => {

      JwtFactory.isAuthExpired = () => {
        return false;
      };

      expect(JwtFactory.isLoginInfoAvailable()).to.equal(true);
    }));

    it('isLoginInfoAvailable() - returns true token and user_id are in the URL', sinon.test( () => {

      JwtFactory.isAuthExpired = () => {
        return true;
      };

      let loginInfo = JwtFactory.isLoginInfoAvailable();

      expect(mockLocalStorage[TOKEN]).to.equal('token');
      expect(mockLocalStorage[USER_ID]).to.equal(4);
      expect(loginInfo).to.equal(true);
    }));


    it('logout removes USER_ID and TOKEN form localStorage', () => {
      mockLocalStorage[TOKEN] = 'token';
      mockLocalStorage[USER_ID] = 'userid';

      JwtFactory.logout();
      expect(mockLocalStorage[TOKEN]).to.equal(undefined);
      expect(mockLocalStorage[USER_ID]).to.equal(undefined);
    });
  });

});
