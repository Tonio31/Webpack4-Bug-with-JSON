import ViaSurveyModule from './viaSurvey';
import ViaSurveyController from './viaSurvey.controller';
import ViaSurveyComponent from './viaSurvey.component';
import ViaSurveyTemplate from './viaSurvey.html';

describe('ViaSurvey', () => {
  let $rootScope, $componentController, $q;
  let SPINNERS, STATES;
  let SpinnerFactory;

  let spies = {
    spinnerFactory: {},
    contentFactory: {},
    state: {},
    utilityFactory: {}
  };

  let listStrength = [
    {
      StrengthName: 'Appreciation of Beauty \u0026 Excellence',
      StrengthDescription: '\r\nNoticing and appreciating beauty, excellence, and/or skilled performance in various domains of life, from nature to art to mathematics to science to everyday experience.'
    },
    {
      StrengthName: 'Bravery',
      StrengthDescription: '\r\nNot shrinking from threat, challenge, difficulty, or pain; speaking up for what’s right even if there’s opposition; acting on convictions even if unpopular; includes physical bravery but is not limited to it.'
    }
  ];

  let listQuestions = [
    {
      QuestionID: 11436,
      QuestionNumber: 1,
      Text: 'Being able to come up with new and different ideas is one of my strong points.',
      AnswerChoices: [
        {
          ChoiceID: 274,
          Text: 'Very Much Like Me'
        },
        {
          ChoiceID: 275,
          Text: 'Like Me'
        },
        {
          ChoiceID: 276,
          Text: 'Neutral'
        },
        {
          ChoiceID: 277,
          Text: 'Unlike Me'
        },
        {
          ChoiceID: 278,
          Text: 'Very Much Unlike Me'
        }
      ]
    },
    {
      QuestionID: 11437,
      QuestionNumber: 2,
      Text: 'I have taken frequent stands in the face of strong opposition.',
      AnswerChoices: [
        {
          ChoiceID: 274,
          Text: 'Very Much Like Me'
        },
        {
          ChoiceID: 275,
          Text: 'Like Me'
        },
        {
          ChoiceID: 276,
          Text: 'Neutral'
        },
        {
          ChoiceID: 277,
          Text: 'Unlike Me'
        },
        {
          ChoiceID: 278,
          Text: 'Very Much Unlike Me'
        }
      ]
    }
  ];


  let blockBinding = {
    id: 30,
    type: 'static',
    element: 'via_survey',
    program_data_code: 'c1.m1.s7.checkbox_1',
    data: {
      config: {
        all_strengths: 'c1.m1.s7.all_strength',
        nb_questions_per_page: 20,
        strength_list_min_selected: 3,
        strength_list_max_selected: 3,
        title_strength_list: 'Your list of strength'
      },
      intro_survey: {
        value: '<h1>Via Survey<\/h1><p>This is a survey that will last 120 questions<\/p><p>It is to evaluate your strenght, click on the button below to start the survey<\/p>'
      },
      intro_results: {
        value: '<h1>Results<\/h1><p>You can find below your strength pre-order a relevant order for you<\/p><p>Choose the 3 that resonates the most with you, these 3 will most likely be at the top of the list but dont hesitate to check all the strength below to choose the ones that resonate the most with you<\/p>'
      }
    }
  };

  let navigationBindings = {
    prevPage: 'prevPage',
    nextPage: 'nextPage'
  };

  let sandbox = sinon.sandbox.create();

  let simulateDataBackFromServer = {
    data: ''
  };

  let simulateErrorDataBackFromServer = 'Error';
  let returnErrorFromViaSurvey = false;
  let returnErrorFromUpdateStep = false;

  let mockData = {
    viaSurvey : () => {
      return {
        $register: () => {
          if (returnErrorFromViaSurvey) {
            return $q.reject(simulateErrorDataBackFromServer);
          }

          return $q.resolve(simulateDataBackFromServer);
        },
        $call: () => {
          if (returnErrorFromViaSurvey) {
            return $q.reject(simulateErrorDataBackFromServer);
          }

          return $q.resolve(simulateDataBackFromServer);
        }
      };
    },
    updateStep: () => {
      return {
        $save: () => {
          if (returnErrorFromUpdateStep) {
            return $q.reject();
          }

          return $q.resolve();
        }
      };
    }
  };



  let mockContentFactory = {
    updateInputFields: () => {},
    getInputFields: () => {
      return { 21159: '745' };
    },
    clearInputFields: () => {},
    getAdditionalData: () => {
      return { token_survey: 'd!@#$%^&*()_+' };
    },
    saveDataToSendLater: () => {},
    clearAdditionalData: () => {},
    setNextStepButtonPreSaveAction: () => {},
    isNextButtonPreSaveAction: () => { return false; },
    nextStepButtonPreSaveAction: () => {},
    beforeNextStepValidation: () => {},
    setBeforeNextStepValidation: () => {},
    setPreviousStepButtonPreAction: () => {},
    isPreviousButtonPreAction: () => { return false; },
    previousStepButtonPreSaveAction: () => {}
  };

  let mockState = {
    go: () => {}
  };

  let mockUtility = {
    saveUserInputToLocalStorage: () => {},
    removeUserInputFromLocalStorage: () => {},
    getUserInputFromLocalStorage: (iQuestionID) => {

      if ( iQuestionID === '99999' ) {
        return false;
      }
      else if ( iQuestionID === blockBinding.data.config.all_strengths ) {
        return false;
      }
      return true;
    }
  };

  beforeEach(window.module(ViaSurveyModule, ($provide) => {
    $provide.value('ContentFactory', mockContentFactory );
    $provide.value('Utility', mockUtility );
    $provide.value('Data', mockData );
    $provide.value('$state', mockState );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $q = $injector.get('$q');
    SpinnerFactory = $injector.get('SpinnerFactory');
    SPINNERS = $injector.get('SPINNERS');
    STATES = $injector.get('STATES');

    spies.spinnerFactory.show = sandbox.stub(SpinnerFactory, 'show');
    spies.spinnerFactory.hide = sandbox.stub(SpinnerFactory, 'hide');

    spies.contentFactory.setBeforeNextStepValidation = sandbox.stub(mockContentFactory, 'setBeforeNextStepValidation');
    spies.contentFactory.setNextStepButtonPreSaveAction = sandbox.stub(mockContentFactory, 'setNextStepButtonPreSaveAction');
    spies.contentFactory.setPreviousStepButtonPreAction = sandbox.stub(mockContentFactory, 'setPreviousStepButtonPreAction');
    spies.contentFactory.updateInputFields = sandbox.stub(mockContentFactory, 'updateInputFields');
    spies.contentFactory.clearInputFields = sandbox.stub(mockContentFactory, 'clearInputFields');
    spies.contentFactory.getInputFields = sandbox.spy(mockContentFactory, 'getInputFields');

    spies.state.go = sandbox.stub(mockState, 'go');
    spies.utilityFactory.saveUserInputToLocalStorage = sandbox.stub(mockUtility, 'saveUserInputToLocalStorage');
    spies.utilityFactory.removeUserInputFromLocalStorage = sandbox.stub(mockUtility, 'removeUserInputFromLocalStorage');
    spies.utilityFactory.getUserInputFromLocalStorage = sandbox.spy(mockUtility, 'getUserInputFromLocalStorage');

  }));

  afterEach( () => {
    sandbox.restore();
    simulateDataBackFromServer.data = '';
    simulateErrorDataBackFromServer = 'Error';
    returnErrorFromViaSurvey = false;
  });

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
  });

  describe('Controller', () => {
    // controller specs
    let controller;
    beforeEach(() => {
      let bindings = {
        block: blockBinding,
        isTopLevelFormSubmitted: false,
        isStepCompleted: false,
        navigation: navigationBindings,
        updateBlockManager: () => {}
      };

      controller = $componentController('viaSurvey', {
        $scope: $rootScope.$new()
      }, bindings);
    });

    it('$onInit() - constant are initialised', () => {

      let registerUserSpy = sandbox.stub(controller, 'registerUser');

      controller.$onInit();
      expect(controller.radioQuestions).to.deep.equal([]);
      expect(controller.tabToDisplay).to.equal('questions');
      expect(controller.config.nbQuestionsDisplayed).to.equal(20);
      expect(controller.numFirstQuestionDisplayed).to.equal(0);
      expect(controller.nbPagesSurvey).to.equal(6);
      expect(controller.currentPageNumber).to.equal(1);
      expect(controller.simulateTopLevelFormSubmitted).to.deep.equal({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      });
      sinon.assert.calledWith(spies.utilityFactory.getUserInputFromLocalStorage, blockBinding.data.config.all_strengths);
      sinon.assert.calledWith(spies.spinnerFactory.show, SPINNERS.COURSE_CONTENT);
      sinon.assert.calledWith(spies.contentFactory.setBeforeNextStepValidation, controller.setTopLevelFormSubmitted);
      sinon.assert.calledWith(spies.contentFactory.setNextStepButtonPreSaveAction, controller.displayNextPageSurvey);
      sinon.assert.calledWith(spies.contentFactory.setPreviousStepButtonPreAction, controller.displayPrevPageSurvey);
      sinon.assert.called(registerUserSpy);
    });


    it('$onInit() - if the list of strength are in Local storage, she should we directly to the result tab', () => {

      spies.utilityFactory.getUserInputFromLocalStorage.restore();

      let test = () => {
        return listStrength;
      };

      spies.utilityFactory.getUserInputFromLocalStorage = sandbox.stub(mockUtility, 'getUserInputFromLocalStorage', test);


      controller.$onInit();
      expect(controller.radioQuestions).to.deep.equal([]);
      expect(controller.tabToDisplay).to.equal('results');
      expect(controller.config.nbQuestionsDisplayed).to.equal(20);
      expect(controller.numFirstQuestionDisplayed).to.equal(0);
      expect(controller.nbPagesSurvey).to.equal(6);
      expect(controller.currentPageNumber).to.equal(1);
      expect(controller.simulateTopLevelFormSubmitted).to.deep.equal({
        1: false,
        2: false,
        3: false,
        4: false,
        5: false,
        6: false,
      });


      sinon.assert.calledWith(spies.utilityFactory.getUserInputFromLocalStorage, blockBinding.data.config.all_strengths);
      sinon.assert.calledWith(spies.contentFactory.updateInputFields, blockBinding.data.config.all_strengths, listStrength);
      sinon.assert.calledWith(spies.contentFactory.setBeforeNextStepValidation, controller.setTopLevelFormSubmitted);
    });

    it('displayPrevPageSurvey() - Change state if the current page is 1', () => {
      controller.currentPageNumber = 1;
      controller.displayPrevPageSurvey();
      sinon.assert.calledWith(spies.state.go, navigationBindings.prevPage);
    });

    it('displayPrevPageSurvey() - Change state if the current page is bigger then the total number of pages', () => {
      controller.currentPageNumber = 6;
      controller.nbPagesSurvey = 5;
      controller.displayPrevPageSurvey();
      sinon.assert.calledWith(spies.state.go, navigationBindings.prevPage);
    });

    it('displayPrevPageSurvey() - Change pages number if currentPage is between 0 and total number of pages', () => {
      controller.currentPageNumber = 6;
      controller.numFirstQuestionDisplayed = 60;
      controller.nbQuestionsDisplayed = 10;
      controller.nbPagesSurvey = 10;
      controller.displayPrevPageSurvey();
      expect(controller.currentPageNumber).to.equal(5);
      expect(controller.numFirstQuestionDisplayed).to.equal(50);
    });

    it('goToErrorState() - hide the spinner and change state', () => {
      controller.goToErrorState();
      sinon.assert.calledWith(spies.spinnerFactory.hide, SPINNERS.COURSE_CONTENT);
      sinon.assert.calledWith(spies.state.go, STATES.ERROR_PAGE, { errorMsg: 'ERROR_UNEXPECTED' }, { reload: true });
    });

    it('setTopLevelFormSubmitted() - update the fake submittedForm object if this.tabToDisplay === \'questions\'', () => {
      controller.tabToDisplay = 'questions';
      controller.currentPageNumber = 6;
      controller.simulateTopLevelFormSubmitted = {
        6: false
      };
      controller.setTopLevelFormSubmitted();
      expect(controller.simulateTopLevelFormSubmitted[controller.currentPageNumber]).to.equal(true);
    });

    it('setTopLevelFormSubmitted() - update the fake submittedForm object if this.tabToDisplay === \'results\'', () => {
      controller.tabToDisplay = 'results';
      controller.isListOfStrengthFormSubmitted = false;
      controller.setTopLevelFormSubmitted();
      expect(controller.isListOfStrengthFormSubmitted).to.equal(true);
    });

    it('displayNextPageSurvey() - Change pages number if currentPage is less than total number of pages', () => {
      controller.currentPageNumber = 6;
      controller.numFirstQuestionDisplayed = 60;
      controller.nbQuestionsDisplayed = 10;
      controller.nbPagesSurvey = 10;
      controller.displayNextPageSurvey();
      expect(controller.currentPageNumber).to.equal(7);
      expect(controller.numFirstQuestionDisplayed).to.equal(70);
      sinon.assert.calledWith(spies.utilityFactory.saveUserInputToLocalStorage, mockContentFactory.getInputFields());
    });

    it('displayNextPageSurvey() - Submit Answers if its the last page and call GetResults is submitAnswers returns true', () => {

      sinon.stub(controller, 'submitAnswers', () => {
        let deferred = $q.defer();
        deferred.resolve({
          data: true
        });
        return deferred.promise;
      });


      let getResultsSpy = sandbox.stub(controller, 'getResults');

      controller.currentPageNumber = 6;
      controller.nbPagesSurvey = 5;
      controller.displayNextPageSurvey();

      $rootScope.$digest();

      sinon.assert.calledWith(spies.spinnerFactory.show, SPINNERS.COURSE_CONTENT);
      sinon.assert.calledOnce(getResultsSpy);
    });

    it('displayNextPageSurvey() - Submit Answers if its the last page and call goToErrorState is submitAnswers returns false', () => {

      sinon.stub(controller, 'submitAnswers', () => {
        let deferred = $q.defer();
        deferred.resolve({
          data: false
        });
        return deferred.promise;
      });


      let goToErrorStateSpy = sandbox.stub(controller, 'goToErrorState');

      controller.currentPageNumber = 6;
      controller.nbPagesSurvey = 5;
      controller.displayNextPageSurvey();

      $rootScope.$digest();

      sinon.assert.calledWith(spies.spinnerFactory.show, SPINNERS.COURSE_CONTENT);
      sinon.assert.calledOnce(goToErrorStateSpy);
    });

    it('onUpdate() - update Content Factory', () => {
      let questionID = '12345';
      let value = '275';
      controller.nbPagesSurvey = 5;
      controller.onUpdate(questionID, value);

      sinon.assert.calledWith(spies.contentFactory.updateInputFields, questionID, value);
    });

    it('transformResultsToCheckBoxBlock() - build a checkbox block form a list of strength', () => {

      controller.$onInit();

      let checkboxBlock = controller.transformResultsToCheckBoxBlock(listStrength);
      expect(checkboxBlock).to.deep.eq({
        id: 52,
        type: 'dynamic',
        element: 'checkbox',
        program_data_code: blockBinding.program_data_code,
        data: {
          config: {
            min_selected: blockBinding.data.config.strength_list_min_selected,
            max_selected: blockBinding.data.config.strength_list_max_selected,
          },
          label: blockBinding.data.config.title_strength_list,
          placeholder: '',
          name: '',
          items: [{
            label: 'Appreciation of Beauty & Excellence',
            sub_label: '\r\nNoticing and appreciating beauty, excellence, and/or skilled performance in various domains of life, from nature to art to mathematics to science to everyday experience.',
            value: 'Appreciation of Beauty & Excellence',
            checked: false,
            feedback: null
          },
          {
            label: 'Bravery',
            sub_label: '\r\nNot shrinking from threat, challenge, difficulty, or pain; speaking up for what’s right even if there’s opposition; acting on convictions even if unpopular; includes physical bravery but is not limited to it.',
            value: 'Bravery',
            checked: false,
            feedback: null
          }]
        }
      });
    });

    it('transformResultsToCheckBoxBlock() -  - build a checkbox block form a list of strength and select some of them', () => {

      controller.$onInit();

      let selectedStrengths = [
        'Appreciation of Beauty & Excellence'
      ];

      let checkboxBlock = controller.transformResultsToCheckBoxBlock(listStrength, selectedStrengths);
      expect(checkboxBlock).to.deep.eq({
        id: 52,
        type: 'dynamic',
        element: 'checkbox',
        program_data_code: blockBinding.program_data_code,
        data: {
          config: {
            min_selected: blockBinding.data.config.strength_list_min_selected,
            max_selected: blockBinding.data.config.strength_list_max_selected,
          },
          label: blockBinding.data.config.title_strength_list,
          placeholder: '',
          name: '',
          items: [{
            label: 'Appreciation of Beauty & Excellence',
            sub_label: '\r\nNoticing and appreciating beauty, excellence, and/or skilled performance in various domains of life, from nature to art to mathematics to science to everyday experience.',
            value: 'Appreciation of Beauty & Excellence',
            checked: true,
            feedback: null
          },
          {
            label: 'Bravery',
            sub_label: '\r\nNot shrinking from threat, challenge, difficulty, or pain; speaking up for what’s right even if there’s opposition; acting on convictions even if unpopular; includes physical bravery but is not limited to it.',
            value: 'Bravery',
            checked: false,
            feedback: null
          }]
        }
      });
    });

    it('saveSurveyResultToBackEnd() - send a request to the back end to save the list of strengths and check that in case of error, we store data to send it to the back end later', () => {

      returnErrorFromUpdateStep = true;

      controller.saveSurveyResultToBackEnd(listStrength);

      // We have to call this here because we want promises to be resolved
      // in order for the functions below to be called
      $rootScope.$digest();

      sinon.assert.calledWith(spies.contentFactory.updateInputFields, controller.block.data.config.all_strengths, listStrength);
    });

    it('getResults() - calls getResults API (success reply from GetResults)', () => {

      simulateDataBackFromServer.data = 'something';
      let saveSurveyResultToBackEndSpy = sandbox.stub(controller, 'saveSurveyResultToBackEnd');
      controller.transformResultsToCheckBoxBlock = (iData) => {
        return iData;
      };

      controller.$onInit();
      controller.getResults(listStrength);

      // We have to call this here because we want promises to be resolved
      // in order for the functions below to be called
      $rootScope.$digest();

      sinon.assert.calledWith(saveSurveyResultToBackEndSpy, simulateDataBackFromServer.data);
      expect(controller.listOfStrengthsForCheckBox).to.equal(simulateDataBackFromServer.data);
      sinon.assert.calledOnce(spies.utilityFactory.removeUserInputFromLocalStorage);
      sinon.assert.calledOnce(spies.contentFactory.clearInputFields);
      sinon.assert.calledWith(spies.contentFactory.setNextStepButtonPreSaveAction, undefined);
      sinon.assert.calledWith(spies.spinnerFactory.hide, SPINNERS.COURSE_CONTENT);
    });

    it('getResults() - calls getResults API (error reply from GetResults)', () => {
      returnErrorFromViaSurvey = true;

      let goToErrorStateSpy = sandbox.stub(controller, 'goToErrorState');
      controller.getResults(listStrength);

      // We have to call this here because we want promises to be resolved
      // in order for the functions below to be called
      $rootScope.$digest();

      sinon.assert.calledOnce(goToErrorStateSpy);
    });

    it('submitAnswers() - return a successful promise', (done) => {
      simulateDataBackFromServer.data = 'something';
      controller.$onInit();

      controller.submitAnswers().then( () => {
        expect(true).to.equal(true);
        done();
      },
      () => {
        assert.fail( 0, 1, 'The promise from submitAnswers() should NOT fail' );
        done();
      });

      $rootScope.$digest();
    });

    it('submitAnswers() - return a rejected promise', (done) => {
      returnErrorFromViaSurvey = true;
      simulateDataBackFromServer.data = 'something';
      controller.$onInit();

      controller.submitAnswers().then( () => {
        assert.fail( 0, 1, 'The promise from submitAnswers() should fail' );
        done();
      },
      (error) => {
        expect(error).to.equal('Error');
        done();
      });

      $rootScope.$digest();
    });

    it('registerUser() - call loginUser in case of success', () => {
      let loginUserSpy = sandbox.stub(controller, 'loginUserRequest');
      controller.registerUser();

      // We have to call this here because we want promises to be resolved
      // in order for the functions below to be called
      $rootScope.$digest();

      sinon.assert.calledOnce(loginUserSpy);
    });

    it('registerUser() - call loginUser in case of error because user is already registered', () => {
      returnErrorFromViaSurvey = true;
      simulateErrorDataBackFromServer = {
        status: 500,
        statusText: 'You have already registered a user with this email address'
      };
      let loginUserSpy = sandbox.stub(controller, 'loginUserRequest');
      controller.registerUser();

      // We have to call this here because we want promises to be resolved
      // in order for the functions below to be called
      $rootScope.$digest();

      sinon.assert.calledOnce(loginUserSpy);
    });

    it('registerUser() - call goToErrorState() in case of unknown error', () => {
      returnErrorFromViaSurvey = true;
      simulateErrorDataBackFromServer = 'This is a weird error';
      let loginUserSpy = sandbox.stub(controller, 'loginUserRequest');
      let goToErrorStateSpy = sandbox.stub(controller, 'goToErrorState');
      controller.registerUser();

      // We have to call this here because we want promises to be resolved
      // in order for the functions below to be called
      $rootScope.$digest();

      sinon.assert.notCalled(loginUserSpy);
      sinon.assert.calledOnce(goToErrorStateSpy);
    });

    it('loginUserRequest() - call startSurveyRequest in case of success', () => {
      let getQuestionsRequestSpy = sandbox.stub(controller, 'getQuestionsRequest');
      simulateDataBackFromServer.data = 'Session Key';
      controller.registerUser();

      // We have to call this here because we want promises to be resolved
      // in order for the functions below to be called
      $rootScope.$digest();

      expect(controller.viaSurveyData.sessionKey).to.equal(simulateDataBackFromServer.data);
      sinon.assert.calledOnce(getQuestionsRequestSpy);
    });

    it('loginUserRequest() - call goToErrorState() in case of unknown error', () => {
      returnErrorFromViaSurvey = true;
      let getQuestionsRequestSpy = sandbox.stub(controller, 'getQuestionsRequest');
      let goToErrorStateSpy = sandbox.stub(controller, 'goToErrorState');
      controller.registerUser();

      // We have to call this here because we want promises to be resolved
      // in order for the functions below to be called
      $rootScope.$digest();

      sinon.assert.notCalled(getQuestionsRequestSpy);
      sinon.assert.calledOnce(goToErrorStateSpy);
    });

    it('calculateCurrentPageNumber() - set currentPageNumber & numFirstQuestionDisplayed depending on the first unanswered question stored in local storage', () => {
      controller.radioQuestions = [
        { program_data_code: '00000' },
        { program_data_code: '11111' },
        { program_data_code: '22222' },
        { program_data_code: '33333' },
        { program_data_code: '44444' },
        { program_data_code: '55555' },
        { program_data_code: '66666' },
        { program_data_code: '77777' },
        { program_data_code: '88888' },
        { program_data_code: '99999' } // This is the first answered question
      ];

      // We display 2 questions per page
      controller.config.nbQuestionsDisplayed = 2;

      controller.currentPageNumber = -1;
      controller.numFirstQuestionDisplayed = -1;

      controller.calculateCurrentPageNumber();
      expect(controller.currentPageNumber).to.equal(5);
      expect(controller.numFirstQuestionDisplayed).to.equal(8);
    });

    it('getQuestionsRequest() - display the list of questions in case of success', () => {

      simulateDataBackFromServer.data = 'something';

      controller.transformQuestionsToRadioBlock = (iData) => {
        return iData;
      };

      let calculateCurrentPageNumberSpy = sandbox.stub(controller, 'calculateCurrentPageNumber');
      simulateDataBackFromServer.data = 'Session Key';
      controller.registerUser();

      // We have to call this here because we want promises to be resolved
      // in order for the functions below to be called
      $rootScope.$digest();

      expect(controller.radioQuestions).to.equal(simulateDataBackFromServer.data);
      sinon.assert.calledOnce(calculateCurrentPageNumberSpy);
    });

    it('getQuestionsRequest() - call goToErrorState() in case of unknown error', () => {
      returnErrorFromViaSurvey = true;
      let getQuestionsRequestSpy = sandbox.stub(controller, 'getQuestionsRequest');
      let goToErrorStateSpy = sandbox.stub(controller, 'goToErrorState');

      controller.registerUser();

      // We have to call this here because we want promises to be resolved
      // in order for the functions below to be called
      $rootScope.$digest();

      sinon.assert.notCalled(getQuestionsRequestSpy);
      sinon.assert.calledOnce(goToErrorStateSpy);
    });

    it('transformQuestionsToRadioBlock() - get an object ready to be injected into radioBox component from a list of questions', () => {

      controller.$onInit();
      let checkboxBlock = controller.transformQuestionsToRadioBlock(listQuestions);
      expect(checkboxBlock).to.deep.eq([
        {
          id: 11436,
          type: 'dynamic',
          program_data_code: 11436,
          data: {
            config: {
              required: true
            },
            label: '1: Being able to come up with new and different ideas is one of my strong points.',
            placeholder: null,
            name: 'Being able to come up with new and different ideas is one of my strong points.',
            items: [
              {
                label: 'Very Much Like Me',
                value: 274,
                sub_label: null,
                selected: false,
                feedback: null
              },
              {
                label: 'Like Me',
                value: 275,
                sub_label: null,
                selected: false,
                feedback: null
              },
              {
                label: 'Neutral',
                value: 276,
                sub_label: null,
                selected: false,
                feedback: null
              },
              {
                label: 'Unlike Me',
                value: 277,
                sub_label: null,
                selected: false,
                feedback: null
              },
              {
                label: 'Very Much Unlike Me',
                value: 278,
                sub_label: null,
                selected: false,
                feedback: null
              }
            ]
          }
        },
        {
          id: 11437,
          type: 'dynamic',
          program_data_code: 11437,
          data: {
            config: {
              required: true
            },
            label: '2: I have taken frequent stands in the face of strong opposition.',
            placeholder: null,
            name: 'I have taken frequent stands in the face of strong opposition.',
            items: [
              {
                label: 'Very Much Like Me',
                value: 274,
                sub_label: null,
                selected: false,
                feedback: null
              },
              {
                label: 'Like Me',
                value: 275,
                sub_label: null,
                selected: false,
                feedback: null
              },
              {
                label: 'Neutral',
                value: 276,
                sub_label: null,
                selected: false,
                feedback: null
              },
              {
                label: 'Unlike Me',
                value: 277,
                sub_label: null,
                selected: false,
                feedback: null
              },
              {
                label: 'Very Much Unlike Me',
                value: 278,
                sub_label: null,
                selected: false,
                feedback: null
              }
            ]
          }
        }
      ]);
    });
  });

  describe('Component', () => {
    // component/directive specs
    let component = ViaSurveyComponent;

    it('includes the intended template', () => {
      expect(component.template).to.equal(ViaSurveyTemplate);
    });

    it('invokes the right controller', () => {
      expect(component.controller).to.equal(ViaSurveyController);
    });
  });
});
