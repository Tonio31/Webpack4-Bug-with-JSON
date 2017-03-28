/* eslint-disable camelcase */

import CourseContentModule from './courseContent';

describe('CourseContent', () => {
  let $rootScope, $state, $stateRegistry, $q, $location, $componentController, $compile;

  let Menu, Data, FORM_NAME_PREFIX;

  let goFn, retrieveMenuAndReturnStatesFn;
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
    FORM_NAME_PREFIX = $injector.get('FORM_NAME_PREFIX');

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
      expect(controller.nextStepButtonLabel).to.eq('COMPLETE');
      expect(controller.displayPreviousButton).to.eq(false);
      expect(controller.congratsBannerText).to.eq('');
    });

    it('test the onInit Function when the current status of the state is \'completed\'', () => {
      controller.content.status = 'completed';
      controller.$onInit();
      expect(controller.nextStepButtonLabel).to.eq('NEXT');
      expect(controller.isStepCompleted).to.eq(true);
      expect(controller.congratsBannerText).to.eq('');
    });

    it('throw an exception if the status is not current or completed', () => {
      controller.content.status = 'locked';
      expect(controller.$onInit).to.throw(`Status of a step should always be current or completed. status=${controller.content.status}`);
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

      sinon.assert.calledWith(locationSpy, 'name: this is the name');
      done();
    }));


    it('nextStep() sends a POST to save current step if it is not yet marked as completed', sinon.test( (done) => {

      let postResponseHeadersFn = () => {
        return {
          status: 'ok'
        };
      };

      let dataBackFromServer = {
        congrats: '<p>Congratulations for finishing this module, you\'re a star<\/p>'
      };

      let updateStepPOSTRequest = {
        $save: (callback) => {
          return callback(dataBackFromServer, postResponseHeadersFn);
        }
      };

      sinon.stub(Data, 'updateStep', () => {
        return updateStepPOSTRequest;
      });

      let form = {
        $invalid: false
      };

      // Add inputs to the saved input to submit to the server
      controller.updateInputFields( 'c1.m1.s1.story_2', 'This is a text');

      controller.$onInit();
      controller.nextStep(form);

      $rootScope.$digest();

      expect(updateStepPOSTRequest.fullUrl).to.equal(controller.content.slug);
      expect(updateStepPOSTRequest.status).to.equal('completed');
      expect(updateStepPOSTRequest.programData).to.deep.equal( [{ code: 'c1.m1.s1.story_2', value: 'This is a text' }] );

      sinon.assert.calledWith(retrieveMenuAndReturnStatesFn, true);
      sinon.assert.calledWith(stateRegistryGetFn, stateNotLocked.name);
      sinon.assert.calledWith(stateRegistryDeregisterFn, stateNotLocked.name);
      sinon.assert.calledWith(stateRegistryRegisterFn, stateNotLocked);
      expect(controller.nextStepButtonLabel).to.eq('NEXT');
      expect(controller.isStepCompleted).to.eq(true);
      expect(controller.congratsBannerText).to.eq('<p>Congratulations for finishing this module, you\'re a star<\/p>');

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

      controller.$onInit();
      controller.nextStep(form);

      sinon.assert.notCalled(retrieveMenuAndReturnStatesFn);

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
