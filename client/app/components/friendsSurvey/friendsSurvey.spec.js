import FriendsSurveyModule from './friendsSurvey';
import FriendsSurveyController from './friendsSurvey.controller';
import FriendsSurveyComponent from './friendsSurvey.component';
import FriendsSurveyTemplate from './friendsSurvey.html';

describe('FriendsSurvey', () => {
  let $rootScope, $componentController, $location, $state;
  let ContentFactory, SURVEY_360, STATES;

  let clearAdditionalDataSpy, saveDataToSendLaterSpy;

  let cleanMockObject = (iMockObject) => {
    Object.keys(iMockObject).forEach( (key) => {
      delete iMockObject[key];
    });
  };

  let mockLocalStorage = {};

  beforeEach(window.module(FriendsSurveyModule, ($provide) => {
    $provide.value('$localStorage', mockLocalStorage );
  }));


  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $location = $injector.get('$location');
    $state = $injector.get('$state');
    SURVEY_360 = $injector.get('SURVEY_360');
    STATES = $injector.get('STATES');
    ContentFactory = $injector.get('ContentFactory');


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
        $scope: $rootScope.$new()
      });
    });

    it('$onInit() - current state  = /360-Survey/2 - Store the token in CourseContent to send it later', () => {

      mockLocalStorage[SURVEY_360.TOKEN] = 'A Token';
      $state.current.name = `${STATES.SURVEY}/2`;
      controller.$onInit();

      sinon.assert.calledWith(saveDataToSendLaterSpy, SURVEY_360.TOKEN, 'A Token');
    });

    it('$onInit() - current state  = /360-Survey/3  - delete local storage data and remove token from course Content', () => {
      mockLocalStorage[SURVEY_360.TOKEN] = 'A Token';
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
