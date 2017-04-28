import FriendsSurveyModule from './friendsSurvey';
import FriendsSurveyController from './friendsSurvey.controller';
import FriendsSurveyComponent from './friendsSurvey.component';
import FriendsSurveyTemplate from './friendsSurvey.html';

describe('FriendsSurvey', () => {
  let $rootScope, $componentController, $location, $state;
  let ContentFactory, TOKEN_SURVEY, STATES;

  let goSpy, searchSpy, clearAdditionalDataSpy, saveDataToSendLaterSpy;

  let cleanMockObject = (iMockObject) => {
    Object.keys(iMockObject).forEach( (key) => {
      delete iMockObject[key];
    });
  };

  let mockLocalStorage = {};
  let stateParams;

  beforeEach(window.module(FriendsSurveyModule, ($provide) => {
    $provide.value('$localStorage', mockLocalStorage );
  }));


  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $location = $injector.get('$location');
    $state = $injector.get('$state');
    TOKEN_SURVEY = $injector.get('TOKEN_SURVEY');
    STATES = $injector.get('STATES');
    ContentFactory = $injector.get('ContentFactory');

    stateParams = {
      [TOKEN_SURVEY]: 'something'
    };

    goSpy = sinon.spy($state, 'go');
    searchSpy = sinon.spy($location, 'search');

    clearAdditionalDataSpy = sinon.spy(ContentFactory, 'clearAdditionalData');
    saveDataToSendLaterSpy = sinon.spy(ContentFactory, 'saveDataToSendLater');

    $location.url = () => {
      return '/A/Super/cool/url';
    };

    cleanMockObject(mockLocalStorage);
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;

    beforeEach(() => {
      controller = $componentController('friendsSurvey', {
        $scope: $rootScope.$new(),
        $stateParams: stateParams
      });
    });

    it('$onInit() - current state  = /360-Survey/1 - Save TOKEN_SURVEY and remove it from the url', () => {
      $state.current.name = `${STATES.SURVEY}/1`;

      controller.$onInit();

      expect(mockLocalStorage).to.deep.eq({ token_survey: 'something' });
      sinon.assert.calledWith(searchSpy, TOKEN_SURVEY, null);
      sinon.assert.calledWith(saveDataToSendLaterSpy, TOKEN_SURVEY, 'something');
    });

    it('$onInit() - current state  = /360-Survey/2 - Store the token in CourseContent to send it later', () => {

      mockLocalStorage[TOKEN_SURVEY] = 'A Token';
      $state.current.name = `${STATES.SURVEY}/2`;
      controller.$onInit();

      sinon.assert.calledWith(saveDataToSendLaterSpy, TOKEN_SURVEY, 'A Token');
    });

    it('$onInit() - current state  = /360-Survey/2  - Go to page not found as no Token is in localStorage', () => {
      $state.current.name = `${STATES.SURVEY}/2`;
      controller.$onInit();

      sinon.assert.calledWith(goSpy, STATES.PAGE_NOT_FOUND_NO_MENU, { intendedUrl: '/A/Super/cool/url' });
    });

    it('$onInit() - current state  = /360-Survey/3  - delete local storage data and remove token from course Content', () => {
      mockLocalStorage[TOKEN_SURVEY] = 'A Token';
      $state.current.name = `${STATES.SURVEY}/3`;
      controller.$onInit();

      sinon.assert.calledOnce(clearAdditionalDataSpy);
      expect(mockLocalStorage).to.deep.eq({});
    });

  });

  describe('Component', () => {
    // component/directive specs
    let component = FriendsSurveyComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(FriendsSurveyTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(FriendsSurveyController);
    });
  });
});
