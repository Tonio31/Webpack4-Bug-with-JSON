import UtilityModule from './utility';

describe('Utility', () => {
  let $state;
  let Utility;
  let goSpy;


  let mockWindow = {
    location: {
      href: 'http://this-should-change.com'
    }
  };

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
    $provide.value('$window', mockWindow );
    $provide.value('User', mockUser );
    $provide.value('$localStorage', mockLocalStorage );
  }));

  beforeEach(inject(($injector) => {
    $state = $injector.get('$state');
    Utility = $injector.get('Utility');

    goSpy = sinon.spy($state, 'go');

    cleanMockObject(mockLocalStorage);
  }));


  describe('Utility Factory', () => {


    it('Redirect to external URL if url is of type http:// or https://', () => {
      let url = 'http://iamtestingifthisworks.com';
      Utility.goToLink(url);

      expect(mockWindow.location.href).to.eq(url);
    });


    it('Change State if the url is not an external URL', () => {
      let url = '/potentialife-course/cycle-1/module-1/step-9';
      Utility.goToLink(url);

      sinon.assert.calledWith(goSpy, url);
    });

    it('buildLocalStorageKey(iKey) builds a key based on userId', () => {
      expect(Utility.buildLocalStorageKey('some_id')).to.eq(`${mockUser.getUserId()}-some_id`);
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

    it('removeUserInputFromLocalStorage(iInputs) remove data form localStorage', () => {
      mockLocalStorage['12-id1'] = '"value1"';
      mockLocalStorage['12-id2'] = '["value2","value2Bis"]';

      let inputs = {
        id1: 'value1',
        id2: ['value2', 'value2Bis']
      };

      Utility.removeUserInputFromLocalStorage(inputs);

      expect(mockLocalStorage).to.deep.eq({});
    });

  });

});
