import UtilityModule from './utility';

describe('Utility', () => {
  let $state, $window, $rootScope;
  let Utility, Data;
  let goSpy, openSpy;

  let sandbox = sinon.sandbox.create();

  let mockUser = {
    getUserId: () => {
      return 12;
    }
  };

  let mockLocalStorage = {};

  let cleanMockObject = (iMockObject) => {
    Object.keys(iMockObject).forEach( (key) => {
      delete iMockObject[key];
    });
  };

  beforeEach(window.module(UtilityModule, ($provide) => {
    $provide.value('User', mockUser );
    $provide.value('$localStorage', mockLocalStorage );
  }));

  beforeEach(inject(($injector) => {
    $state = $injector.get('$state');
    Utility = $injector.get('Utility');
    Data = $injector.get('Data');
    $window = $injector.get('$window');
    $rootScope = $injector.get('$rootScope');

    openSpy = sandbox.stub($window, 'open');
    goSpy = sandbox.spy($state, 'go');

    cleanMockObject(mockLocalStorage);
  }));

  afterEach( () => {
    sandbox.restore();
  });

  describe('Utility Factory', () => {


    it('Redirect to external URL if url is of type http:// or https://', sinon.test( () => {
      let url = 'http://iamtestingifthisworks.com';
      Utility.goToLink(url);

      sinon.assert.calledWith(openSpy, url, '_blank');
    }));


    it('Change State if the url is not an external URL', () => {
      let url = '/potentialife-course/cycle-1/module-1/step-9';
      Utility.goToLink(url);

      sinon.assert.calledWith(goSpy, url);
    });



    it('buildLocalStorageKey(iKey) builds a key based on userId', () => {
      expect(Utility.buildLocalStorageKey('some_id')).to.eq(`${mockUser.getUserId()}-some_id`);
    });

    it('saveToLocalStorage() save key/value to local storage', () => {
      let key = 'key';
      let value = 'value';

      Utility.saveToLocalStorage(key, value);

      expect(mockLocalStorage).to.deep.eq({ '12-key': '"value"' });
    });

    it('getFromLocalStorage() save key/value to local storage', () => {
      mockLocalStorage['12-key'] = '"value1"';

      expect(Utility.getFromLocalStorage('key')).to.deep.eq('value1');
    });

    it('removeFromLocalStorage(key) remove data form localStorage with a key (string) in parameter', () => {
      mockLocalStorage['12-id1'] = '"value1"';

      Utility.removeFromLocalStorage('id1');

      expect(mockLocalStorage).to.deep.eq({});
    });

    it('saveUserInputToLocalStorage(iInputs) save to local storage', () => {
      let inputs = {
        id1: 'value1',
        id2: ['value2', 'value2Bis']
      };

      Utility.saveUserInputToLocalStorage(inputs);

      expect(mockLocalStorage).to.deep.eq({ '12-id1': '"value1"', '12-id2': '["value2","value2Bis"]' });
    });

    it('getUserInputFromLocalStorage(iKey) returns the value from localStorage', () => {
      mockLocalStorage['12-id1'] = '"value1"';
      mockLocalStorage['12-id2'] = '["value2","value2Bis"]';

      expect(Utility.getUserInputFromLocalStorage('id2')).to.deep.eq([ 'value2', 'value2Bis' ]);
    });

    it('removeUserInputFromLocalStorage(iInputs) remove data form localStorage with an Object in parameters', () => {
      mockLocalStorage['12-id1'] = '"value1"';
      mockLocalStorage['12-id2'] = '["value2","value2Bis"]';

      let inputsObject = {
        id1: 'value1',
        id2: ['value2', 'value2Bis']
      };

      Utility.removeUserInputFromLocalStorage(inputsObject);

      expect(mockLocalStorage).to.deep.eq({});
    });

    it('removeUserInputFromLocalStorage(iInputs) remove data form localStorage with an Array of keys in parameters', () => {
      mockLocalStorage['12-id1'] = '"value1"';
      mockLocalStorage['12-id2'] = '["value2","value2Bis"]';

      let inputsArray = [ 'id1', 'id2' ];

      Utility.removeUserInputFromLocalStorage(inputsArray);

      expect(mockLocalStorage).to.deep.eq({});
    });

    it("getUserTargetWebsite() - auth succeed on 'my'", sinon.test( (done) => {

      let authDataBackFromServer = {
        status: 'ok'
      };

      let checkAuthOnOtherPlWebsitePOST = {
        $check: (callback) => {
          return callback(authDataBackFromServer);
        }
      };

      sinon.stub(Data, 'checkAuthOnOtherPlWebsite', () => {
        return checkAuthOnOtherPlWebsitePOST;
      });

      Utility.getUserTargetWebsite('user@email.com', ['my', 'change']).then( (websiteToTarget) => {
        expect(websiteToTarget).to.equal('my');
        done();
      },
      () => {
        assert.fail(0, 1, 'We should not return an error if the server status:ok');
        done();
      });
      $rootScope.$digest();
    }));

    it("getUserTargetWebsite() - auth failed on 'my' but succeed on 'change'", sinon.test( (done) => {

      let authUserNotFoundReply = {
        status: 'User not found'
      };

      let checkAuthPOSTReplyUserNotFound = {
        $check: (callback) => {
          return callback(authUserNotFoundReply);
        }
      };


      let authUserFoundReply = {
        status: 'ok'
      };

      let checkAuthPOSTReplyUserFound = {
        $check: (callback) => {
          return callback(authUserFoundReply);
        }
      };

      let checkAuthOnOtherPlWebsiteSpy = sinon.stub(Data, 'checkAuthOnOtherPlWebsite');
      checkAuthOnOtherPlWebsiteSpy.onFirstCall().returns(checkAuthPOSTReplyUserNotFound);
      checkAuthOnOtherPlWebsiteSpy.onSecondCall().returns(checkAuthPOSTReplyUserFound);

      Utility.getUserTargetWebsite('user@email.com', ['my', 'change']).then( (websiteToTarget) => {
        expect(websiteToTarget).to.equal('change');
        done();
      },
      () => {
        assert.fail(0, 1, 'We should not return an error if the server status:ok');
        done();
      });
      $rootScope.$digest();
    }));
  });

});
