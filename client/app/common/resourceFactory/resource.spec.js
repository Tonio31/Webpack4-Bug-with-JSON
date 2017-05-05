import ResourceModule from './resource';

describe('Resource', () => {
  let User, Data, WEBSITE_CONFIG, TOKEN_SURVEY;
  let $httpBackend, $location, $window;

  let participant = require('app/mockBackEndResponse/participants.json');
  let userId = 12;

  let cleanMockObject = (iMockObject) => {
    Object.keys(iMockObject).forEach( (key) => {
      delete iMockObject[key];
    });
  };

  let mockLocalStorage = {};

  beforeEach(window.module(ResourceModule, ($provide) => {
    $provide.value('$localStorage', mockLocalStorage );
  }));

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get('$httpBackend');
    $location = $injector.get('$location');
    $window = $injector.get('$window');
    User = $injector.get('User');
    Data = $injector.get('Data');
    WEBSITE_CONFIG = $injector.get('WEBSITE_CONFIG');
    TOKEN_SURVEY = $injector.get('TOKEN_SURVEY');

    $window.ga = () => {};

    $location.search = () => {
      return {
        [TOKEN_SURVEY]: 'ThisIsAToken'
      };
    };

    cleanMockObject(mockLocalStorage);

    sinon.stub(User, 'getUserId', () => { return userId; } );
  }));

  afterEach( () => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe('Resource Factory', () => {
      // Factory specs

    it('buildApiUrl(\'reflexion\', false) build an url without the userId', () => {
      let endPoint = 'reflexion';

      expect(Data.buildApiUrl('reflexion', false)).to.deep.equal(`${WEBSITE_CONFIG.apiUrl}/${endPoint}`);
    });


    it('buildApiUrl(\'reflexion\', true) build an url with the userId', () => {
      let endPoint = 'reflexion';

      expect(Data.buildApiUrl('reflexion', true)).to.deep.equal(`${WEBSITE_CONFIG.apiUrl}/${endPoint}/${userId}`);
    });

    // This will test the retrieval of the menuData and the convertMenuData function
    it('getMenu() returns a promise', (done) => {

      let menu = Data.getMenu();
      expect(menu.name).to.equal('Resource');
      done();
    });

    it('getParticipantDetails() calls the server and stores user related data', sinon.test( (done) => {

      $httpBackend.whenGET(Data.buildApiUrl('participants', true)).respond( () => {
        return [ 200, participant, {} ];
      });

      let setUserSpy = sinon.spy(User, 'setUser');

      Data.getParticipantDetails();
      $httpBackend.flush();
      sinon.assert.calledWith(setUserSpy, {
        email: 'tonio.mandela@usertest.com',
        firstName: 'tonio',
        id: 4,
        lastName: 'mandela',
        cohort: 'BAC001',
        company: 'Barclays',
        division: 'Sales',
        companyBanner: {
          bgColor: 'orange',
          header: 'Inspiring Leadership',
          logo: 'https://logos.keycdn.com/keycdn-logo.png',
          subHeader: 'BE YOUR BEST, BE THE DIFFERENCE',
          textColor: 'white'
        }
      });

      done();
    }));


    it('getDynamicContentPromise() return a resolved promise if the server returns no error', sinon.test( (done) => {

      let regexpStep = new RegExp('https:\/\/localhost\.com\/step\?.*');
      $httpBackend.whenGET(regexpStep).respond( () => {
        return [ 200, { data: 'some data' }, {} ];
      });

      let contentPromise = Data.getDynamicContentPromise('step', false, { slug: 'something' });

      contentPromise.then( (dataFromServer) => {
        expect(dataFromServer.data).to.equal('some data');
        done();
      })
      .catch( () => {
        assert.fail(0, 1, 'We should not return an error if the server returns positive response');
      });

      $httpBackend.flush();
    }));

    it('getDynamicContentPromise() return a rejected promise if the server returns an error', sinon.test( (done) => {

      let regexpStep = new RegExp('https:\/\/localhost\.com\/step\?.*');
      $httpBackend.whenGET(regexpStep).respond( () => {
        return [ 404, { data: 'some data' }, {} ];
      });

      let contentPromise = Data.getDynamicContentPromise('step', false, { slug: 'something' });


      contentPromise.catch( (dataFromServer) => {
        expect(dataFromServer.data).to.deep.equal({ data: 'some data' });
        done();
      });

      $httpBackend.flush();
    }));

    it('getFriendSurveyContent() return a rejected promise if the server returns an error', sinon.test( (done) => {

      let regexpStep = new RegExp('https:\/\/localhost\.com\/survey\?.*');
      $httpBackend.whenGET(regexpStep).respond( () => {
        return [ 200, { data: 'some data' }, {} ];
      });

      Data.getFriendSurveyContent({});

      expect(mockLocalStorage).to.deep.eq({ token_survey: 'ThisIsAToken' });

      $httpBackend.flush();
      done();
    }));


    it('getUserAuthData() return a promise', sinon.test( (done) => {

      $httpBackend.whenPOST(Data.buildApiUrl('authenticate')).respond( () => {
        return [ 200, {}, {} ];
      });

      let userAuthPOST = Data.getUserAuthData();

      userAuthPOST.$save( () => {
        assert(true, 'Positive response form the back end');
        done();
      })
      .catch( () => {
        assert.fail(0, 1, 'We should not return an error if the server returns positive response');
        done();
      });

      $httpBackend.flush();

      done();
    }));

    it('updateStep() return a promise', sinon.test( (done) => {

      $httpBackend.whenPOST(Data.buildApiUrl('program_data')).respond( () => {
        return [ 200, {}, {} ];
      });

      let updateStepPOST = Data.updateStep();

      updateStepPOST.$save( () => {
        assert(true, 'Positive response form the back end');
        done();
      })
        .catch( () => {
          assert.fail(0, 1, 'We should not return an error if the server returns positive response');
          done();
        });

      $httpBackend.flush();

      done();
    }));
  });


});
