/* eslint-disable camelcase */

import CourseContentModule from './courseContent';

describe('CourseContent', () => {
  let $rootScope, $state, $stateRegistry, $q, $location, $componentController, $compile;

  let Menu, Data, Utility, SpinnerFactory, FORM_NAME_PREFIX, SPINNERS;

  let goFn, retrieveMenuAndReturnStatesFn, removeUserInputSpy, saveUserInputSpy, spinnerShowSpy, spinnerHideSpy;
  let stateRegistryGetFn, stateRegistryDeregisterFn, stateRegistryRegisterFn;

  let contentBindings = require('app/mockBackEndResponse/potentialife-course_cycle-3_module-31_step-2.json');

  let stateNotLocked = {
    name: '/potentialife-course/cycle-1/module-1/step-9',
    url: '/potentialife-course/cycle-1/module-1/step-9',
    parent: 'main',
    component: 'courseContent',
    resolve: {}
  };

  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(CourseContentModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $location = $injector.get('$location');
    $state = $injector.get('$state');
    $stateRegistry = $injector.get('$stateRegistry');
    $q = $injector.get('$q');
    $compile = $injector.get('$compile');
    Menu = $injector.get('Menu');
    Data = $injector.get('Data');
    Utility = $injector.get('Utility');
    SpinnerFactory = $injector.get('SpinnerFactory');
    FORM_NAME_PREFIX = $injector.get('FORM_NAME_PREFIX');
    SPINNERS = $injector.get('SPINNERS');

    goFn = sinon.stub($state, 'go');
    retrieveMenuAndReturnStatesFn = sinon.stub(Menu, 'retrieveMenuAndReturnStates', () => {
      let deferred = $q.defer();

      deferred.resolve([stateNotLocked]);
      return deferred.promise;
    });

    stateRegistryGetFn = sinon.stub($stateRegistry, 'get', () => {
      let stateLocked = angular.copy(stateNotLocked);
      stateLocked.component = 'lockedPage';
      return stateLocked;
    });

    stateRegistryDeregisterFn = sinon.stub( $stateRegistry, 'deregister', () => {} );
    stateRegistryRegisterFn = sinon.spy($stateRegistry, 'register');

    removeUserInputSpy = sinon.spy(Utility, 'removeUserInputFromLocalStorage');
    saveUserInputSpy = sinon.spy(Utility, 'saveUserInputToLocalStorage');

    spinnerShowSpy = sinon.spy(SpinnerFactory, 'show');
    spinnerHideSpy = sinon.spy(SpinnerFactory, 'hide');
  }));

  describe('Controller', () => {
    // controller specs
    let controller;
    let bindings = {
      content: contentBindings
    };

    beforeEach(() => {
      controller = $componentController('courseContent', {
        $scope: $rootScope.$new(),
      }, bindings);

    });

    afterEach(() => {
      controller.content.status = 'current';
    });

    it('test the onInit Function when the current status of the state is \'current\'', () => {
      controller.content.status = 'current';
      controller.content.prev_page_url = null;
      controller.$onInit();
      expect(controller.nextStepButton.label).to.eq('COMPLETE');
      expect(controller.displayPreviousButton).to.eq(false);
      expect(controller.banner.text).to.eq('');
    });

    it('test the onInit Function when the current status of the state is \'completed\'', () => {
      controller.content.status = 'completed';
      controller.$onInit();
      expect(controller.nextStepButton.label).to.eq('NEXT');
      expect(controller.isStepCompleted).to.eq(true);
      expect(controller.banner.text).to.eq('');
    });

    it('previousStep() triggers a change of state using this.content.prev_page_url', sinon.test( () => {
      controller.previousStep();
      sinon.assert.calledWith(goFn, controller.content.prev_page_url);
    }));

    it('nextStep() focus the user on the field in error if the form is invalid', sinon.test( (done) => {

      let topLevelForm = {
        $invalid: true
      };

      let subFormName = `${FORM_NAME_PREFIX}52`;
      topLevelForm[subFormName] = {
        $invalid: true
      };

      let locationSpy = sinon.spy($location, 'hash');

      controller.$onInit();
      controller.nextStep(topLevelForm);

      sinon.assert.calledWith(locationSpy, 'name');
      done();
    }));


    it('nextStep() sends a POST to save current step if it is not yet marked as completed', sinon.test( (done) => {

      let dataBackFromServer = {
        congrats: '<p>Congratulations for finishing this module, you\'re a star<\/p>'
      };

      let updateStepPOSTRequest = {
        $save: (callback) => {
          return callback(dataBackFromServer);
        }
      };

      sinon.stub(Data, 'updateStep', () => {
        return updateStepPOSTRequest;
      });

      let form = {
        $invalid: false
      };

      // Add inputs to the saved input to submit to the server
      controller.updateInputFields( 'c1.m1.s1.story_2', 'This is a text' );

      controller.$onInit();
      controller.nextStep(form);

      $rootScope.$digest();

      expect(updateStepPOSTRequest.fullUrl).to.equal(controller.content.fullUrl);
      expect(updateStepPOSTRequest.status).to.equal('completed');
      expect(updateStepPOSTRequest.programData).to.deep.equal( [{ code: 'c1.m1.s1.story_2', value: 'This is a text' }] );

      sinon.assert.calledOnce(retrieveMenuAndReturnStatesFn);
      sinon.assert.calledWith(removeUserInputSpy, { 'c1.m1.s1.story_2': 'This is a text' });
      sinon.assert.calledWith(stateRegistryGetFn, stateNotLocked.name);
      sinon.assert.calledWith(stateRegistryDeregisterFn, stateNotLocked.name);
      sinon.assert.calledWith(stateRegistryRegisterFn, stateNotLocked);
      sinon.assert.calledWith(spinnerShowSpy, SPINNERS.SAVING_STEP);
      sinon.assert.calledWith(spinnerHideSpy, SPINNERS.SAVING_STEP);
      expect(controller.nextStepButton.label).to.eq('NEXT');
      expect(controller.isStepCompleted).to.eq(true);
      expect(controller.banner.text).to.eq('<p>Congratulations for finishing this module, you\'re a star<\/p>');

      // We have to call done() at the end of the test to notify chai that the test is done (because we have async code in this test)
      done();
    }));

    it('nextStep() sends a POST to save current step & change state if the flag skipShowingBanner is true', sinon.test( (done) => {

      let dataBackFromServer = {};

      let updateStepPOSTRequest = {
        $save: (callback) => {
          return callback(dataBackFromServer);
        }
      };

      sinon.stub(Data, 'updateStep', () => {
        return updateStepPOSTRequest;
      });

      let form = {
        $invalid: false
      };


      controller.$onInit();
      controller.skipShowingBanner = true; // Simulate a step where we don't show the banner

      controller.nextStep(form);

      $rootScope.$digest();

      expect(updateStepPOSTRequest.fullUrl).to.equal(controller.content.fullUrl);
      expect(updateStepPOSTRequest.status).to.equal('completed');
      expect(updateStepPOSTRequest.programData).to.deep.equal( [] );

      sinon.assert.calledOnce(retrieveMenuAndReturnStatesFn);
      sinon.assert.calledWith(removeUserInputSpy, {});
      sinon.assert.calledWith(stateRegistryGetFn, stateNotLocked.name);
      sinon.assert.calledWith(stateRegistryDeregisterFn, stateNotLocked.name);
      sinon.assert.calledWith(stateRegistryRegisterFn, stateNotLocked);
      sinon.assert.calledWith(goFn, controller.content.next_page_url);
      expect(controller.nextStepButton.label).to.eq('NEXT');
      expect(controller.isStepCompleted).to.eq(true);
      expect(controller.banner.text).to.eq('');

      // We have to call done() at the end of the test to notify chai that the test is done (because we have async code in this test)
      done();
    }));

    it('nextStep() sends a POST to save current step but we simulate error on back end side', sinon.test( (done) => {

      let error = {
        error: 'token_not_provided'
      };

      let updateStepPOSTRequest = {
        $save: (callback, callbackError) => {
          return callbackError(error);
        }
      };

      sinon.stub(Data, 'updateStep', () => {
        return updateStepPOSTRequest;
      });

      let form = {
        $invalid: false
      };


      // Add inputs to be saved in local storage
      controller.updateInputFields( 'c1.m1.s1.story_2', 'This is a text');

      controller.$onInit();
      controller.nextStep(form);

      sinon.assert.notCalled(retrieveMenuAndReturnStatesFn);

      sinon.assert.calledWith( saveUserInputSpy, { 'c1.m1.s1.story_2': 'This is a text' } );
      expect(controller.banner.class).to.eq('banner-error');


      // We have to call done() at the end of the test to notify chai that the test is done (because we have async code in this test)
      done();
    }));


    it('nextStep() triggers a change of state using this.content.next_page_url if the step is already completed', sinon.test( () => {
      controller.content.status = 'completed';
      controller.$onInit();

      let form = {
        $invalid: false
      };

      controller.nextStep(form);
      sinon.assert.calledWith(goFn, controller.content.next_page_url);
    }));

    it('convertInputFieldForPOST convert the user inputs for sending into the POST request', () => {

      let inputFields = {
        'c1.m1.s1.story_2': 'This is a text',
        'c1.m1.s1.story_4': ['first value', 'second value']
      };

      let expectedConvertedInputs = [
        {
          code: 'c1.m1.s1.story_2',
          value: 'This is a text'
        },
        {
          code: 'c1.m1.s1.story_4',
          value: ['first value', 'second value']
        }
      ];


      let inputConverted = controller.convertInputFieldForPOST(inputFields);

      expect(inputConverted).to.deep.eq(expectedConvertedInputs);
    });
  });

  describe('View', () => {
    // view layer specs.
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      scope.content = require('app/mockBackEndResponse/genericContent.json');
      template = $compile('<course-content content="content"></course-content>')(scope);
      scope.$apply();
    });

    it('has h1 title in page', () => {
      expect(template.find('h1').html()).to.eq('This is the title of this step');
    });

  });

});
