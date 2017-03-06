import CourseContentModule from './courseContent';

describe('CourseContent', () => {
  let $rootScope, $httpBackend, $state, $componentController, $compile;

  let Menu, Data;

  let goFn, retrieveMenuAndReturnStatesFn;

  let contentBindings = require('app/mockBackEndResponse/potentialife-course_cycle-1_module-1_step-1.json');

  let mockTranslateFilter = (value) => {
    return value;
  };

  beforeEach(window.module(CourseContentModule, ($provide) => {
    $provide.value('translateFilter', mockTranslateFilter );
  }));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $state = $injector.get('$state');
    $compile = $injector.get('$compile');
    $httpBackend = $injector.get('$httpBackend');
    Menu = $injector.get('Menu');
    Data = $injector.get('Data');

    goFn = sinon.stub($state, 'go');
    retrieveMenuAndReturnStatesFn = sinon.stub(Menu, 'retrieveMenuAndReturnStates');
  }));

  describe('Module', () => {
    // top-level specs: i.e., routes, injection, naming
/*    it('courseContent component should be visible when navigates to /courseContent', () => {
      $location.url('/');
      $rootScope.$digest();
      expect($state.current.component).to.eq('courseContent');
    });*/
  });

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
      controller.$onInit();
      expect(controller.nextStepButtonLabel).to.eq('COMPLETE');
      expect(controller.displayPreviousButton).to.eq(false);
      expect(controller.displayCongratsBanner).to.eq(false);
    });

    it('test the onInit Function when the current status of the state is \'completed\'', () => {
      controller.content.status = 'completed';
      controller.$onInit();
      expect(controller.nextStepButtonLabel).to.eq('NEXT');
      expect(controller.isStepCompleted).to.eq(true);
      expect(controller.displayCongratsBanner).to.eq(false);
    });

    it('throw an exception if the status is not current or completed', () => {
      controller.content.status = 'locked';
      expect(controller.$onInit).to.throw(`Status of a step should always be current or completed. status=${controller.content.status}`);
    });

    it('previousStep() triggers a change of state using this.content.prev_page_url', sinon.test( () => {
      controller.previousStep();
      sinon.assert.calledWith(goFn, controller.content.prev_page_url);
    }));

    it('nextStep() sends a POST to save current step if it is not yet marked as completed', sinon.test( (done) => {

      $httpBackend.whenPOST(Data.buildApiUrl('step')).respond( () => {
        let responseHeaders = {
          status: 'ok'
        };
        return [ 200, {}, responseHeaders ];
      });

      controller.$onInit();
      controller.nextStep();

      // Resolve promise, we have to do this in unit test when promise are involved
      $httpBackend.flush();

      sinon.assert.calledWith(retrieveMenuAndReturnStatesFn, true);
      expect(controller.nextStepButtonLabel).to.eq('NEXT');
      expect(controller.isStepCompleted).to.eq(true);
      expect(controller.displayCongratsBanner).to.eq(true);

      // We have to call done() at the end of the test to notify chai that the test is done (because we have async code in this test)
      done();
    }));

    it('nextStep() sends a POST to save current step but we simulate error on back end side', sinon.test( (done) => {

      $httpBackend.whenPOST(Data.buildApiUrl('step')).respond( () => {
        return [ 401, { error: 'token_not_provided' }, {} ];
      });

      controller.$onInit();
      controller.nextStep();

      // Resolve promise, we have to do this in unit test when promise are involved
      $httpBackend.flush();

      sinon.assert.notCalled(retrieveMenuAndReturnStatesFn);

      // We have to call done() at the end of the test to notify chai that the test is done (because we have async code in this test)
      done();
    }));


    it('nextStep() triggers a change of state using this.content.next_page_url if the step is already completed', sinon.test( () => {
      controller.content.status = 'completed';
      controller.$onInit();
      controller.nextStep();
      sinon.assert.calledWith(goFn, controller.content.next_page_url);
    }));

    it('has a name property', () => { // erase if removing this.name from the controller
      expect(controller).to.have.property('name');
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
