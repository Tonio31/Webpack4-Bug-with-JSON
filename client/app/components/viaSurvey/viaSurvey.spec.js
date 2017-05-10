import ViaSurveyModule from './viaSurvey';
import ViaSurveyController from './viaSurvey.controller';
import ViaSurveyComponent from './viaSurvey.component';
import ViaSurveyTemplate from './viaSurvey.html';

describe('ViaSurvey', () => {
  let $rootScope, $componentController, $compile;

  let blockBinding = {
    id: 30,
    type: 'static',
    element: 'via_survey',
    program_data_code: null,
    config: {
      match_strength_data_code: 'c1.m1.s7.checkbox_1',
      all_strengths: 'c1.m1.s7.all_strength',
      nb_questions_per_page: 120
    },
    data: {
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

  beforeEach(window.module(ViaSurveyModule));

  beforeEach(inject(($injector) => {
    $rootScope = $injector.get('$rootScope');
    $componentController = $injector.get('$componentController');
    $compile = $injector.get('$compile');
  }));

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

  });

  describe('View', () => {
    // view specs
    let scope, template;

    beforeEach(() => {
      scope = $rootScope.$new();
      template = $compile('<via-survey></via-survey>')(scope);
      scope.$apply();
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
