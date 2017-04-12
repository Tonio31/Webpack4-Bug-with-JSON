import ViaSurveyModule from './viaSurvey';
import ViaSurveyController from './viaSurvey.controller';
import ViaSurveyComponent from './viaSurvey.component';
import ViaSurveyTemplate from './viaSurvey.html';

describe('ViaSurvey', () => {
  let $rootScope, $componentController, $compile;

/*  let question = {
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
  };*/


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
      controller = $componentController('viaSurvey', {
        $scope: $rootScope.$new()
      });
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
